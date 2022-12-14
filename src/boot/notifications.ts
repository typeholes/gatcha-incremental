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

Notify.registerType('crisis', {
  icon: 'announcement',
  progress: true,
  color: 'green',
  textColor: 'black',
  classes: 'glossy',
});

Notify.registerType('retirement', {
  icon: 'announcement',
  progress: true,
  color: 'purple',
  textColor: 'white',
  classes: 'glossy',
});

Notify.registerType('reset', {
  icon: 'announcement',
  progress: true,
  color: 'red-14',
  textColor: 'white',
  classes: 'glossy',
});
