import { mount } from 'svelte'
import '@fontsource-variable/archivo/wdth.css'
import './app.css'
import App from './App.svelte'

// Motion is opt-in: content is laid out at rest, and only visitors who allow
// motion get the cards dealt in.
if (!matchMedia('(prefers-reduced-motion: reduce)').matches) document.documentElement.classList.add('motion')

export default mount(App, { target: document.getElementById('app') })
