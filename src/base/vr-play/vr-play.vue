<template>
  <div class="vr-play">
    <a-scene>
      <a-entity particle-system="particleCount: 15000; preset: dust; maxAge: 3; texture: https://ucarecdn.com/d9699a61-4bd8-4699-9966-4118715db5f8/; size: 1.4; velocityValue: 0 4 0" position="0 15 -5"></a-entity>
      <a-entity ply-model="src: https://ucarecdn.com/c2d8adc1-47c8-4c32-83b1-d1369fde79bc/" position="7 -4 -25" scale=".8 .8 .8" rotation="-90 0 0"></a-entity>
      <a-sky color="#24CAFF"></a-sky>
      <a-light type="ambient" color="#FFF"></a-light>
      <a-light type="directional" color="#BBB" position="-1 1 0"></a-light>

      <!-- <audio src="http://dl.stream.qqmusic.qq.com/C400002XnIJm4DbR6g.m4a?vkey=4CB37D2827FD85579F5E98364F7A4C7D3F8F485EEFCAAAD949C3EF6BB2755252EAC19F861F56E16C0E325205C49B47F75918F494A73CC87F&guid=4987297440&uin=0&fromtag=66" autoplay></audio> -->
      <a-assets>
        <audio id="Theme" :src="src" preload="auto"></audio>
      </a-assets>

      <a-entity position="0 0 -1" sound="src:#Theme;autoplay:true;loop:true" rotation="0 0 0" scale="1 1 1" visible="true"></a-entity>
    </a-scene>
  </div>
</template>

<script>
export default {
  data () {
    return {
      src: 'static/sound/C400002XnIJm4DbR6g.m4a'
    }
  }
}
</script>
