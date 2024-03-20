<script setup lang="ts"></script>

<template>
  <q-card>
    <q-markup-table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Version</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>3/19/2024</td>
          <td>v0.01</td>
          <td>Mostly unplayable initial prototype</td>
        </tr>
        <tr>
          <td>3/19/2024</td>
          <td>v0.02</td>
          <td>added changelog and splash screen</td>
        </tr>
      </tbody>
    </q-markup-table>
    <span>TODO</span>
    <ul>
      <li>splash screen introducing the concept of the game</li>
      <li>help/information panel</li>
      <li>better unfolding of mechanics</li>
      <li>fix inflation issues</li>
      <li>
        add events to bring your net worth back towards 0 when you idle to long
      </li>
      <li>add cool downs to responding</li>
      <li>
        scale costs of respond max by some sub-linear factor of response count
      </li>
      <li>make respond max an unlockable</li>
    </ul>
  </q-card>
</template>
