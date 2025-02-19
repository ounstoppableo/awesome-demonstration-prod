'use client';
import {
  IconBrandGithub,
  IconBrandX,
  IconExchange,
  IconHome,
  IconNewSection,
  IconTerminal2,
} from '@tabler/icons-react';
import { Carousel } from '@/components/carousel/carousel';
import { FloatingDock } from '@/components/floating-dock/floating-dock';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  backgroundEffectMap,
  selectBackgroundEffects,
  setBackgroundEffect,
} from '@/store/background-effects/background-effects-slice';
import { FlickeringGrid } from '@/components/background/grid-background/grid-background';
import { Waves } from '@/components/background/wave-background/wave-background';
import { selectTheme, setTheme } from '@/store/theme/theme-slice';
import { Sun, Moon, Plus, Pencil, Component, Files } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/dialog/index';
import { Button } from '@/components/buttons/button-three';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/form';
import { Input } from '@/components/input';
import {
  SelectValue,
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectGroup,
} from '@/components/selector/selector';

import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTrigger,
} from '@/components/steps';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/tabs/tabs';

import {
  MultipleSelector,
  type Option,
} from '@/components/multi-selector/index';
import { Input as FileUpload } from '@/components/file-upload/base';
import { packageParse } from './lib/data';
import { cloneDeep } from 'lodash';
import { Switch } from '@/components/switch';

export default function MainPage() {
  const router = useRouter();
  const slideData = [
    {
      title: 'Mystic Mountains',
      button: 'Explore Component',
      handleClick: (e: any) => {
        router.push('/editor');
      },
      src: 'https://images.unsplash.com/photo-1494806812796-244fe51b774d?q=80&w=3534&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      title: 'Urban Dreams',
      button: 'Explore Component',
      handleClick: (e: any) => {
        router.push('/editor');
      },
      src: 'https://images.unsplash.com/photo-1518710843675-2540dd79065c?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      title: 'Neon Nights',
      button: 'Explore Component',
      handleClick: (e: any) => {
        router.push('/editor');
      },
      src: 'https://images.unsplash.com/photo-1590041794748-2d8eb73a571c?q=80&w=3456&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      title: 'Desert Whispers',
      button: 'Explore Component',
      handleClick: (e: any) => {
        router.push('/editor');
      },
      src: 'https://images.unsplash.com/photo-1679420437432-80cfbf88986c?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
  ];
  const theme = useAppSelector(selectTheme);
  const links = [
    {
      title: 'Home',
      icon: (
        <IconHome className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: '#',
    },

    {
      title: 'Products',
      icon: (
        <IconTerminal2 className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: '#',
    },
    {
      title: 'Components',
      icon: (
        <IconNewSection className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: '#',
    },
    {
      title: 'Aceternity UI',
      icon: (
        <img
          src="https://assets.aceternity.com/logo-dark.png"
          className="h-[20px] w-[20px]"
          alt="Aceternity Logo"
        />
      ),
      href: '#',
    },
    {
      title: 'Backgrounds',
      icon: (
        <IconExchange className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: '#',
      handleClick: (e: any) => {
        backgroundEffectMap[currentBackgroundEffect].removeBackground();
        const newBackgroundEffect = Object.keys(backgroundEffectMap).filter(
          (key) => key !== currentBackgroundEffect,
        );
        dispatch(
          setBackgroundEffect(
            newBackgroundEffect[
              Math.floor(Math.random() * newBackgroundEffect.length)
            ] as any,
          ),
        );
      },
    },

    {
      title: 'Theme',
      icon: theme !== 'dark' ? <Moon /> : <Sun />,
      href: '#',
      handleClick: (e: any) => {
        const newTheme =
          document.documentElement.className === 'dark' ? 'light' : 'dark';
        dispatch(setTheme(newTheme));
      },
    },
    {
      title: 'GitHub',
      icon: (
        <IconBrandGithub className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: '#',
    },
  ];
  const formSchema = z.object({
    componentName: z.string().nonempty({ message: '' }),
    framework: z.array(z.string()).nonempty({ message: '' }),
    editComponentId: z.string().nonempty({ message: '' }),
    addOrEdit: z.string(),
    files: z
      .object({
        html: z.object({
          entryFile: z
            .object({
              fileName: z.string().nonempty({ message: '' }),
              filePath: z.string().nonempty({ message: '' }),
            })
            .nullable(),
          relevantFiles: z.array(
            z.object({
              fileName: z.string().nonempty({ message: '' }),
              filePath: z.string().nonempty({ message: '' }),
            }),
          ),
        }),
        vue: z
          .object({
            entryFile: z.object({
              fileName: z.string().nonempty({ message: '' }),
              filePath: z.string().nonempty({ message: '' }),
            }),
            relevantFiles: z.array(
              z.object({
                fileName: z.string().nonempty({ message: '' }),
                filePath: z.string().nonempty({ message: '' }),
              }),
            ),
          })
          .nullable(),
        react: z
          .object({
            entryFile: z.object({
              fileName: z.string().nonempty({ message: '' }),
              filePath: z.string().nonempty({ message: '' }),
            }),
            relevantFiles: z.array(
              z.object({
                fileName: z.string().nonempty({ message: '' }),
                filePath: z.string().nonempty({ message: '' }),
                external: z.boolean(),
              }),
            ),
          })
          .nullable(),
      })
      .nullable(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      editComponentId: 'default',
      componentName: '',
      framework: ['html'],
      addOrEdit: 'add',
      files: {
        html: {
          entryFile: {
            fileName: '',
            filePath: '',
          },
          relevantFiles: [],
        },
        vue: {
          entryFile: {
            fileName: '',
            filePath: '',
          },
          relevantFiles: [],
        },
        react: {
          entryFile: {
            fileName: '',
            filePath: '',
          },
          relevantFiles: [],
        },
      },
    },
  });

  const [activeStep, setActiveStep] = useState(1);
  const handleStepChange = (e: number) => {
    form.handleSubmit(
      () => {
        setActiveStep(e);
      },
      (params) => {
        console.log(params);
        console.log(form.getValues());
        if (activeStep > e) {
          form.clearErrors();
          return setActiveStep(e);
        }

        if (params['editComponentId']) {
          if (activeStep !== 1) {
            form.clearErrors();
          }
          return setActiveStep(1);
        }
        if (params['componentName'] || params['framework'] || params['files']) {
          if (activeStep !== 2) {
            form.clearErrors();
          }
          return setActiveStep(2);
        }
      },
    )();
  };

  const frameworkOptions: Option[] = [
    { value: 'html', label: 'HTML', category: 'Framework' },
    { value: 'vue', label: 'Vue', category: 'Framework' },
    { value: 'react', label: 'React', category: 'Framework' },
  ];

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  const currentBackgroundEffect = useAppSelector(selectBackgroundEffects);
  const dispatch = useAppDispatch();
  useEffect(() => {
    currentBackgroundEffect &&
      backgroundEffectMap[currentBackgroundEffect].setBackground();
    return () => {
      currentBackgroundEffect &&
        backgroundEffectMap[currentBackgroundEffect].removeBackground();
    };
  }, [currentBackgroundEffect]);

  useEffect(() => {
    backgroundEffectMap[currentBackgroundEffect].removeBackground();
    backgroundEffectMap[currentBackgroundEffect].setBackground();
    return () => {
      backgroundEffectMap[currentBackgroundEffect].removeBackground();
    };
  }, [theme]);

  const getBackgroundEffect = () => {
    switch (currentBackgroundEffect) {
      case 'particles':
        return <div id="particles-js" className="absolute inset-0 -z-10"></div>;
      case 'grid':
        return (
          <FlickeringGrid
            className="-z-10 absolute inset-0 size-full"
            squareSize={8}
            gridGap={8}
            color="#6B7280"
            maxOpacity={0.5}
            flickerChance={1}
          />
        );
      case 'wave':
        return (
          <Waves
            lineColor={
              theme === 'dark'
                ? 'rgba(255, 255, 255, 0.3)'
                : 'rgba(0, 0, 0, 0.3)'
            }
            backgroundColor="transparent"
            waveSpeedX={0.02}
            waveSpeedY={0.01}
            waveAmpX={40}
            waveAmpY={20}
            friction={0.9}
            tension={0.01}
            maxCursorMove={120}
            xGap={12}
            yGap={36}
          />
        );
    }
  };
  const onBeforeUpload = (files: File[]) => {
    for (let i = 0; i < files.length; i++) {
      if (files[i].size / 1024 / 1024 > 10) {
        return false;
      }
    }
    return true;
  };

  const relevantFileLastImportFilesMap = useRef<any>({});

  const formItems = () => {
    switch (activeStep) {
      case 1:
        return (
          <div className="flex justify-between gap-4">
            <FormField
              control={form.control}
              name="addOrEdit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Add or Edit</FormLabel>
                  <FormControl>
                    <Select
                      defaultValue={field.value}
                      onValueChange={(e) => {
                        form.setValue('addOrEdit', e);
                        if (e === 'add') {
                          form.setValue('editComponentId', 'default');
                        } else {
                          form.setValue('editComponentId', '');
                        }
                      }}
                    >
                      <SelectTrigger className="[&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_svg]:shrink-0 [&>span_svg]:text-muted-foreground/80 w-[180px]">
                        <SelectValue placeholder="Select operate type" />
                      </SelectTrigger>
                      <SelectContent className="[&_*[role=option]>span>svg]:shrink-0 [&_*[role=option]>span>svg]:text-muted-foreground/80 [&_*[role=option]>span]:end-2 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:flex [&_*[role=option]>span]:items-center [&_*[role=option]>span]:gap-2 [&_*[role=option]]:pe-8 [&_*[role=option]]:ps-2">
                        <SelectGroup>
                          <SelectItem value="add">
                            <Plus />
                            <span className="truncate">Add</span>
                          </SelectItem>
                          <SelectItem value="edit">
                            <Pencil />
                            <span className="truncate">Edit</span>
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
            {form.watch('addOrEdit') === 'edit' ? (
              <FormField
                control={form.control}
                name="editComponentId"
                key="editComponentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Component</FormLabel>
                    <FormControl>
                      <Select
                        defaultValue={field.value}
                        onValueChange={(e) =>
                          form.setValue('editComponentId', e)
                        }
                      >
                        <SelectTrigger className="[&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_svg]:shrink-0 [&>span_svg]:text-muted-foreground/80 w-[180px]">
                          <SelectValue placeholder="Select operate type" />
                        </SelectTrigger>
                        <SelectContent className="[&_*[role=option]>span>svg]:shrink-0 [&_*[role=option]>span>svg]:text-muted-foreground/80 [&_*[role=option]>span]:end-2 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:flex [&_*[role=option]>span]:items-center [&_*[role=option]>span]:gap-2 [&_*[role=option]]:pe-8 [&_*[role=option]]:ps-2">
                          <SelectGroup>
                            <SelectItem value="test">
                              <Component />
                              <span className="truncate">Test Component</span>
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <></>
            )}
          </div>
        );
      case 2:
        return (
          <>
            <FormField
              control={form.control}
              name="componentName"
              key="componentName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Component Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Input components name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="framework"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Framework</FormLabel>
                  <FormControl>
                    <MultipleSelector
                      placeholder="Select framework..."
                      value={field.value.map((framework) => ({
                        value: framework,
                        label:
                          framework === 'html'
                            ? 'HTML'
                            : framework === 'vue'
                              ? 'Vue'
                              : 'React',
                        category: 'Framework',
                      }))}
                      defaultOptions={frameworkOptions}
                      groupBy="category"
                      className="w-full"
                      onChange={(e) =>
                        form.setValue(
                          'framework',
                          e.map((item) => item.value) as any,
                        )
                      }
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            {form.watch('framework').length === 0 ? (
              <></>
            ) : (
              <Tabs
                defaultValue={form.getValues('framework')[0] as string}
                className="flex flex-col h-full"
              >
                <TabsList className="relative h-auto w-full gap-0.5 bg-transparent p-0 before:absolute before:inset-x-0 before:bottom-0 before:h-px before:bg-border justify-start pl-0.5 pt-0.5">
                  {form.getValues('framework').map((framework) => (
                    <TabsTrigger
                      key={framework}
                      value={framework}
                      className="overflow-hidden rounded-b-none border-x border-t border-border bg-muted py-2 data-[state=active]:z-10 data-[state=active]:shadow-none"
                    >
                      {framework === 'html' ? (
                        <>
                          <svg className="icon" aria-hidden="true">
                            <use xlinkHref="#icon-HTML"></use>
                          </svg>
                          <span className="truncate">HTML</span>
                        </>
                      ) : framework === 'vue' ? (
                        <>
                          <svg className="icon" aria-hidden="true">
                            <use xlinkHref="#icon-Vue"></use>
                          </svg>
                          <span className="truncate">Vue</span>
                        </>
                      ) : (
                        <>
                          <svg className="icon" aria-hidden="true">
                            <use xlinkHref="#icon-react"></use>
                          </svg>
                          <span className="truncate">React</span>
                        </>
                      )}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {form.getValues('framework').map((framework) => {
                  return (
                    <TabsContent
                      value={framework}
                      key={framework}
                      className="p-0.5 flex-1 m-0"
                    >
                      <div className="w-full flex flex-col">
                        <div className="flex flex-col">
                          <div className="font-bold py-2">
                            Entry File Fields
                          </div>
                          <div className="flex gap-4">
                            <div className="flex-[0.3]">
                              <FormField
                                control={form.control}
                                name={
                                  `files.${framework}.entryFile.fileName` as any
                                }
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>File Name</FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="Input fileName"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <div className="flex-[0.7]">
                              <FormField
                                control={form.control}
                                name={
                                  `files.${framework}.entryFile.filePath` as any
                                }
                                render={({ field }) => {
                                  const onUploadSuccess = (res: any) => {
                                    if (res.code === 200) {
                                      form.setValue(
                                        `files.${framework}.entryFile.filePath` as any,
                                        res.data[0]?.filePath,
                                      );
                                      if (
                                        res.data[0]?.fileName.endsWith('.ts') ||
                                        res.data[0]?.fileName.endsWith('.js') ||
                                        res.data[0]?.fileName.endsWith(
                                          '.tsx',
                                        ) ||
                                        res.data[0]?.fileName.endsWith(
                                          '.jsx',
                                        ) ||
                                        res.data[0]?.fileName.endsWith(
                                          '.vue',
                                        ) ||
                                        !res.data[0]
                                      ) {
                                        packageParse({
                                          filePath: res.data[0]?.filePath,
                                        }).then((res: any) => {
                                          if (res.code === 200) {
                                            const importFiles = res.data.map(
                                              (resItem: any) => ({
                                                fileName: resItem,
                                                filePath: '',
                                                external: false,
                                              }),
                                            );
                                            form.setValue(
                                              `files.${framework}.relevantFiles` as any,
                                              importFiles,
                                            );
                                          }
                                        });
                                      }
                                    }
                                  };
                                  return (
                                    <FormItem>
                                      <FormLabel>File Path</FormLabel>
                                      <FormControl>
                                        <FileUpload
                                          className="p-0 pe-3 file:me-3 file:border-0 file:border-e"
                                          action="fileUploader"
                                          onBeforUpload={onBeforeUpload}
                                          onUploadSuccess={onUploadSuccess}
                                          accept={
                                            framework === 'html'
                                              ? '.html'
                                              : framework === 'vue'
                                                ? '.vue'
                                                : '.tsx,.jsx'
                                          }
                                        ></FileUpload>
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  );
                                }}
                              />
                            </div>
                          </div>
                        </div>
                        {form.watch(`files.${framework}.relevantFiles` as any)
                          .length ? (
                          <div>
                            <div className="font-bold py-2">
                              Relevant File Fields
                            </div>
                            <div className="flex flex-col gap-4 w-full overflow-y-auto max-h-44 noScrollBar">
                              {(
                                form.getValues(
                                  `files.${framework}.relevantFiles` as any,
                                ) as any
                              )?.map((relevantFile: any, index: number) => {
                                return (
                                  <div
                                    className="flex gap-4"
                                    key={relevantFile.fileName}
                                  >
                                    <div className="flex-[0.3]">
                                      <FormField
                                        control={form.control}
                                        name={
                                          `files.${framework}.relevantFiles[${index}].fileName` as any
                                        }
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormLabel>File Name</FormLabel>
                                            <FormControl>
                                              <Input
                                                placeholder="Input fileName"
                                                {...field}
                                                disabled
                                              />
                                            </FormControl>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />
                                    </div>
                                    <div className="flex-[0.6]">
                                      {form.watch(
                                        `files.${framework}.relevantFiles[${index}].external` as any,
                                      ) ? (
                                        <FormField
                                          control={form.control}
                                          name={
                                            `files.${framework}.relevantFiles[${index}].filePath` as any
                                          }
                                          render={({ field }) => (
                                            <FormItem>
                                              <FormLabel>File Path</FormLabel>
                                              <FormControl>
                                                <Input
                                                  placeholder="Input filePath"
                                                  {...field}
                                                />
                                              </FormControl>
                                              <FormMessage />
                                            </FormItem>
                                          )}
                                        />
                                      ) : (
                                        <FormField
                                          control={form.control}
                                          name={
                                            `files.${framework}.relevantFiles[${index}].filePath` as any
                                          }
                                          render={({ field }) => {
                                            const onUploadSuccess = (
                                              res: any,
                                            ) => {
                                              if (res.code === 200) {
                                                form.setValue(
                                                  `files.${framework}.relevantFiles[${index}].filePath` as any,
                                                  res.data[0]?.filePath,
                                                );
                                                if (
                                                  res.data[0]?.fileName.endsWith(
                                                    '.ts',
                                                  ) ||
                                                  res.data[0]?.fileName.endsWith(
                                                    '.js',
                                                  ) ||
                                                  res.data[0]?.fileName.endsWith(
                                                    '.tsx',
                                                  ) ||
                                                  res.data[0]?.fileName.endsWith(
                                                    '.jsx',
                                                  ) ||
                                                  res.data[0]?.fileName.endsWith(
                                                    '.vue',
                                                  ) ||
                                                  !res.data[0]
                                                ) {
                                                  packageParse({
                                                    filePath:
                                                      res.data[0]?.filePath,
                                                  }).then((packageRes: any) => {
                                                    if (
                                                      packageRes.code === 200
                                                    ) {
                                                      const importFiles =
                                                        packageRes.data.map(
                                                          (resItem: any) => ({
                                                            fileName: resItem,
                                                            filePath: '',
                                                            external: false,
                                                          }),
                                                        );
                                                      const relevantFileId =
                                                        form.getValues(
                                                          `files.${framework}.relevantFiles[${index}].fileName` as any,
                                                        ) +
                                                        '-' +
                                                        framework;

                                                      const lastRelevantImportFiles =
                                                        cloneDeep(
                                                          relevantFileLastImportFilesMap
                                                            .current[
                                                            relevantFileId
                                                          ],
                                                        );
                                                      relevantFileLastImportFilesMap.current[
                                                        relevantFileId
                                                      ] = importFiles.filter(
                                                        (file: any) =>
                                                          !form
                                                            .getValues(
                                                              `files.${framework}.relevantFiles` as any,
                                                            )
                                                            .find(
                                                              (
                                                                currentFile: any,
                                                              ) =>
                                                                currentFile.fileName ===
                                                                file.fileName,
                                                            ),
                                                      );
                                                      const currentImportFiles =
                                                        [
                                                          ...form
                                                            .getValues(
                                                              `files.${framework}.relevantFiles` as any,
                                                            )
                                                            .filter(
                                                              (item: any) =>
                                                                !lastRelevantImportFiles?.find(
                                                                  (
                                                                    lastFile: any,
                                                                  ) =>
                                                                    lastFile.fileName ===
                                                                    item.fileName,
                                                                ),
                                                            ),
                                                          ...importFiles,
                                                        ];
                                                      // 去重
                                                      const currentImportFilesRD =
                                                        currentImportFiles.reduce(
                                                          (acc, curr) => {
                                                            if (
                                                              !acc.some(
                                                                (item: any) =>
                                                                  item.fileName ===
                                                                  curr.fileName,
                                                              )
                                                            ) {
                                                              acc.push(curr);
                                                            }
                                                            return acc;
                                                          },
                                                          [],
                                                        );
                                                      form.setValue(
                                                        `files.${framework}.relevantFiles` as any,
                                                        currentImportFilesRD,
                                                      );
                                                    }
                                                  });
                                                }
                                              }
                                            };
                                            return (
                                              <FormItem>
                                                <FormLabel>File Path</FormLabel>
                                                <FormControl>
                                                  <FileUpload
                                                    className="p-0 pe-3 file:me-3 file:border-0 file:border-e"
                                                    action="fileUploader"
                                                    onBeforUpload={
                                                      onBeforeUpload
                                                    }
                                                    onUploadSuccess={
                                                      onUploadSuccess
                                                    }
                                                    accept={
                                                      framework === 'html'
                                                        ? '.css,.js'
                                                        : framework === 'vue'
                                                          ? '.vue,.ts,.js'
                                                          : '.tsx,.jsx,.ts,.js'
                                                    }
                                                  ></FileUpload>
                                                </FormControl>
                                                <FormMessage />
                                              </FormItem>
                                            );
                                          }}
                                        />
                                      )}
                                    </div>
                                    <div className="flex-[0.1] flex">
                                      <FormField
                                        control={form.control}
                                        name={
                                          `files.${framework}.relevantFiles[${index}].external` as any
                                        }
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormLabel>External</FormLabel>
                                            <FormControl>
                                              <div className="flex pt-1.5">
                                                <Switch
                                                  checked={field.value}
                                                  onCheckedChange={
                                                    field.onChange
                                                  }
                                                />
                                              </div>
                                            </FormControl>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ) : (
                          <></>
                        )}
                      </div>
                    </TabsContent>
                  );
                })}
              </Tabs>
            )}
          </>
        );
    }
  };

  const handleSubmitBtnClick = () => {
    switch (activeStep) {
      case 1:
        handleStepChange(2);
        break;
      case 2:
        handleStepChange(3);
      case 3:
        form.handleSubmit(onSubmit)();
        break;
    }
  };

  return (
    <div className="h-[100vh]">
      <div className="absolute overflow-hidden w-full h-full pt-24">
        <Carousel slides={slideData} />
      </div>
      <div className="absolute z-20 flex items-center bottom-12 justify-center h-fit w-fit select-none left-[50%] translate-x-[-50%]">
        <FloatingDock mobileClassName="translate-y-20" items={links} />
      </div>
      <Dialog>
        <DialogTrigger>
          <div className="absolute left-2 h-10 w-10 z-[9999] text-neutral-600 dark:text-neutral-200 bottom-12 rounded-[2.5rem] hover:w-48 bg-neutral-200 dark:bg-neutral-800 transition-all duration-300 overflow-hidden">
            <div className="h-10 w-10 rounded-[9999px]  flex justify-center items-center">
              <Plus />
              <div className="absolute w-40 left-7">Add Component</div>
            </div>
          </div>
        </DialogTrigger>
        <DialogContent className="w-fit">
          <DialogHeader>
            <DialogTitle>Add Component</DialogTitle>
            <DialogDescription>
              Add your components here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <Stepper value={activeStep} onValueChange={handleStepChange}>
            {[1, 2, 3].map((step) => (
              <StepperItem
                step={step}
                key={step}
                className="[&:not(:last-child)]:flex-1"
              >
                <StepperTrigger>
                  <StepperIndicator />
                </StepperTrigger>
                <StepperSeparator />
              </StepperItem>
            ))}
          </Stepper>
          <Form {...form}>
            <form className="space-y-4">{formItems()}</form>
          </Form>
          <DialogFooter>
            <Button type="submit" onClick={handleSubmitBtnClick}>
              {activeStep === 1 || activeStep === 2 ? 'Next' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {getBackgroundEffect()}
    </div>
  );
}
