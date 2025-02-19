import { NextRequest } from 'next/server';
import * as acorn from 'acorn';
import ts from 'typescript';
import fs from 'fs';
import tsPlugin from 'acorn-typescript';

const tsAcorn = acorn.Parser.extend(tsPlugin() as any);

function traverseNode(node: any, cb: (...params: any) => any) {
  cb(node);
  for (const key in node) {
    if (node[key] && typeof node[key] === 'object') {
      traverseNode(node[key], cb);
    }
  }
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const filePath = searchParams.get('filePath') as string;
    if (!filePath) throw new Error('参数不完整！');
    if (
      !filePath.endsWith('.ts') &&
      !filePath.endsWith('.js') &&
      !filePath.endsWith('.tsx') &&
      !filePath.endsWith('.jsx') &&
      !filePath.endsWith('.vue')
    )
      throw new Error('错误的文件路径！');
    const fileContent = fs.readFileSync(filePath).toString();

    const importRegex = /import\s+[^'"]*['"][^'"]+['"];?/g;
    const allImports = fileContent.match(importRegex) || [];

    const nonFrameworkImports = allImports.filter(
      (importStatement: any) =>
        !importStatement.includes("'vue'") &&
        !importStatement.includes('"vue"') &&
        !importStatement.includes("'react'") &&
        !importStatement.includes('"react"'),
    );

    const result = new Set();

    nonFrameworkImports.map((item) => {
      const ast = tsAcorn.parse(item, {
        sourceType: 'module',
        ecmaVersion: 'latest',
      });
      traverseNode(ast, (node) => {
        if (node.type === 'ImportDeclaration') {
          result.add(node.source.value);
        }
      });
    });

    return Response.json({
      code: 200,
      data: Array.from(result),
    });
  } catch (err) {
    console.log(err);
    return Response.json({
      code: 200,
      data: [],
    });
  }
}
