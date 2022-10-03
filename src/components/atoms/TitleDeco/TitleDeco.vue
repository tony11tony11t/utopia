<!-- eslint-disable vuejs-accessibility/click-events-have-key-events -->
<template>
  <div class="group">
    <div class="frame444">
      <div class="headingContent">
        <div class="textGroup">
          <div class="Status">
            <!-- <span>來電</span> -->
            <div class="text">來電</div>
          </div>
          <div class="frame4400" @click="onClickWord">
            <img
              src="../../../assets/headContent/Name.svg"
              alt=""
              class="nameImg"
            />
            <img
              src="../../../assets/headContent/Timeing.svg"
              alt=""
              class="timeImg"
            />
          </div>
        </div>
      </div>
      <div class="deco">
        <img
          @click="decoClick"
          src="../../../assets/headContent/Vector15.svg"
          alt=""
          class="decoLeft"
        />
        <img
          @click="decoClick"
          src="../../../assets/headContent/DecoMiddle.svg"
          alt=""
          class="decoMiddle"
        />
        <img
          @click="decoClick"
          src="../../../assets/headContent/DecoRight.svg"
          alt=""
          class="decoRight"
        />
      </div>
      <div class="closeIcon" @click="onClick">
        <div class="Group47">
          <img
            src="../../../assets/headContent/Rectangle1.svg"
            alt=""
            class="rect1"
          />
          <img
            src="../../../assets/headContent/Rectangle2.svg"
            alt=""
            class="rect2"
          />
        </div>
        <p>關</p>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted } from 'vue'

export default {
  data() {
    return {}
  },
  props: {
    onClick: Function,
    onClickWord: Function,
    decoClick: Function,
  },

  mounted() {},
}
</script>

<style lang="scss" scoped>
.group {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
  position: relative;
  width: 390px;
  height: 116.43px;
}

.frame444 {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 390px;
  height: 116.43px;
}

.headingContent {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0px;
  // position: absolute;
  // width: 265px;
  height: 83px;
  // left: calc(50% - 265px / 2 + 0.5px);
  // top: calc(50% - 83px / 2 - 6.72px);
}
.textGroup {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0px;
  gap: 8px;
  width: 265px;
  height: 83px;
  flex: none;
  order: 0;
  flex-grow: 0;
}
.text {
  width: 45px;
  height: 20px;
  font-family: 'Glow Sans TC';
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  text-align: center;
  letter-spacing: 0.5em;
  color: #330020;
  flex: none;
  order: 0;
  flex-grow: 0;
}
.Status {
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 2px 40px;
  gap: 40px;
  width: 125px;
  height: 24px;
  border: 2px solid #330020;
  filter: drop-shadow(0px 1px 1.5px rgba(255, 255, 255, 0.26));
  border-radius: 20px;
}
.Status p {
  width: 45px;
  height: 20px;
  font-family: 'Glow Sans TC';
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  text-align: center;
  letter-spacing: 1em;
  color: #330020;
}
.frame4400 {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0px;
  gap: 6px;
  width: 265px;
  height: 51px;
}
.nameImg {
  width: 265px;
  // height: 29px;
  font-family: 'Glow Sans TC';
  font-style: normal;
  font-weight: 400;
  font-size: 20px;
  line-height: 29px;
  text-align: center;
  letter-spacing: 0.15em;
  color: #ff8133;
  text-shadow: 0px 1px 8px rgba(255, 94, 0, 0.3);
}
.timeImg {
  width: 73px;
  height: 16px;
  font-family: 'Montserrat';
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  text-align: center;
  letter-spacing: 0.1em;
  color: #ffc499;
}
.deco {
  // position: absolute;
  position: relative;
  display: flex;
  width: 390px;
  // height: 34.43px;
  // top: -1px;
  left: -5px;
  // top: 82px;
}
.decoLeft {
  position: absolute;
  left: 0%;
  right: 36.41%;
  top: -5px;
  bottom: 42.03%;
  // border: 2px solid #330020;
  box-shadow: 0px 1px 1.5px rgba(255, 255, 255, 0.26);
  // border-radius: 10px;
  // transform: matrix(-1, 0, 0, 1, 0, 0);
}
.decoMiddle {
  box-sizing: border-box;
  position: absolute;
  left: 34.62%;
  right: 34.62%;
  top: 4px;
  bottom: 0%;
  // border: 2px solid #330020;
  box-shadow: 0px 1px 1.5px rgba(255, 255, 255, 0.26);
}
.decoRight {
  position: absolute;
  left: 68.21%;
  right: 0%;
  top: -5px;
  bottom: 42.03%;
  // border: 2px solid #330020;
  box-shadow: 0px 1px 1.5px rgba(255, 255, 255, 0.26);
}
.closeIcon {
  position: absolute;
  left: 86.67%;
  right: 2.45%;
  top: 0%;
  bottom: 63.56%;
  filter: drop-shadow(0px 1px 1.5px rgba(255, 255, 255, 0.26));
}
.Group47 {
  position: absolute;
  left: 50%;
  right: -20.71%;
  top: 0%;
  bottom: 29.29%;
  transform: rotate(45deg);
}
.closeIcon p {
  position: absolute;
  left: 50%;
  bottom: -30%;
}
.rect2 {
  box-sizing: border-box;
  position: absolute;
  left: 96%;
  // right: 44.48%;
  top: 140%;
  // bottom: -5.52%;
  // border: 2px solid #330020;
  transform: rotate(-45deg);
}

.rect1 {
  box-sizing: border-box;
  position: absolute;
  left: 6.67%;
  right: 32.05%;
  top: 43.33%;
  bottom: -4.62%;
  transform: rotate(-45deg);
}
</style>
