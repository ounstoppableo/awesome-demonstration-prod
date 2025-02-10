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
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  backgroundEffectMap,
  selectBackgroundEffects,
  setBackgroundEffect,
} from '@/store/background-effects/background-effects-slice';
import { FlickeringGrid } from '@/components/background/grid-background/grid-background';
import { Waves } from '@/components/background/wave-background/wave-background';
import { selectTheme, setTheme } from '@/store/theme/theme-slice';
import { Sun, Moon, Plus } from 'lucide-react';

export default function CarouselDemo() {
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

  return (
    <div className="h-[100vh]">
      <div className="absolute overflow-hidden w-full h-full pt-20">
        <Carousel slides={slideData} />
      </div>
      <div className="absolute z-20 flex items-center bottom-12 justify-center h-fit w-fit select-none left-[50%] translate-x-[-50%]">
        <FloatingDock mobileClassName="translate-y-20" items={links} />
      </div>
      <div className="absolute left-2 h-10 w-10 z-[9999] text-neutral-600 dark:text-neutral-200 bottom-12 rounded-[2.5rem] hover:w-48 bg-neutral-200 dark:bg-neutral-800 transition-all duration-300 overflow-hidden">
        <button className="h-10 w-10 rounded-[9999px]  flex justify-center items-center">
          <Plus />
          <div className="absolute w-40 left-7">Add Component</div>
        </button>
      </div>
      {getBackgroundEffect()}
    </div>
  );
}
