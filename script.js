import lottieWeb from "https://cdn.skypack.dev/lottie-web";

const fileInput = document.getElementById("fileInput");
const uploadBtn = document.getElementById("uploadBtn");
const canvasElement = document.createElement("canvas");
const ctx = canvasElement.getContext("2d");

const lottie2Gif = (animationData) => {
  canvasElement.width = animationData.w;
  canvasElement.height = animationData.h;
  const playerConfig = {
    renderer: "canvas",
    loop: true,
    autoplay: true,
    animationData,
    rendererSettings: {
      context: ctx,
    },
  };
  const lottie = lottieWeb.loadAnimation(playerConfig);
  lottie.goToAndStop(0, true);
  const gif = new GIF({
    workers: 10,
    width: animationData.w,
    height: animationData.h,
    workerScript: "./vendor/gif.worker.js",
    transparent: "rgba(0,0,0,0)",
  });
  const delay = (1 / lottie.frameRate) * 1000;
  const totalFrames = lottie.totalFrames;
  for (let i = 0; i < totalFrames; i++) {
    lottie.goToAndStop(i, true);
    gif.addFrame(ctx, { delay, copy: true });
  }
  gif.on("finished", function (blob) {
    window.open(URL.createObjectURL(blob));
    uploadBtn.disabled = false;
    uploadBtn.querySelector("p").innerText = "Upload";
  });
  gif.render();
};

uploadBtn.addEventListener("click", () => {
  fileInput.click();
});

fileInput.addEventListener("change", async (e) => {
  const json = await e.target.files[0].text();
  const animationData = JSON.parse(json);
  lottie2Gif(animationData);
  uploadBtn.disabled = true;
  uploadBtn.querySelector("p").innerText = "Processing";
});
