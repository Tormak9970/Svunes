import '../shared.css';
import './popout.css';
import Popout from './Popout.svelte';

const popout = new Popout({
  target: document.getElementById('popout')!,
});

export default popout;
