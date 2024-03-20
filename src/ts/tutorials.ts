import SplashScreen from  '../components/tutorials/SplashScreen.vue';
import {type Game} from 'src/ts/game'

export const tutorialComponents = {
  SplashScreen: SplashScreen,
} as const satisfies Partial<Record<keyof Game['tutorialFlags'],unknown>>
