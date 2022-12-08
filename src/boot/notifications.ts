import { Notify } from 'quasar';

Notify.registerType('responseTier', {
  icon: 'announcement',
  progress: true,
  color: 'darkblue',
  textColor: 'white',
  classes: 'glossy',
});

Notify.registerType('tier', {
  icon: 'announcement',
  progress: true,
  color: 'brown',
  textColor: 'white',
  classes: 'glossy',
});

Notify.registerType('prestige', {
  icon: 'announcement',
  progress: true,
  color: 'green',
  textColor: 'black',
  classes: 'glossy',
});
