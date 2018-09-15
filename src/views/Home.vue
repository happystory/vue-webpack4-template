<template>
  <div class="home">
    <img src="./highlight_bg.png" alt="">
    <div class="test">
      test234234
    </div>
  </div>
</template>

<script>
export default {
  name: 'home',
  mounted() {
    console.log(process.env.BASE_URL);
  },
};
</script>

<style lang="scss" scoped>
.test {
  display: flex;
}
</style>
