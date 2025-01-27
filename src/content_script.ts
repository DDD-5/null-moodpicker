import { post } from "./common/api";

chrome.storage.sync.get(["isPickMode", "token"], ({ isPickMode, token }) => {
  if (token) {
    addClickListenerOnBodyBy(isPickMode);
  }
});

const addClickListenerOnBodyBy = (isPickMode: boolean) => {
  if (isPickMode) {
    document.body.addEventListener("click", pickImage);
    return;
  }
  document.body.removeEventListener("click", pickImage);
}

chrome.runtime.onMessage.addListener(({ isPickMode }) => {
  if (isPickMode !== undefined) {
    addClickListenerOnBodyBy(isPickMode);
  }
});

let TIMER: NodeJS.Timeout | null;

const pickImage = (event: MouseEvent) => {
  if (event.target instanceof HTMLImageElement) {
    event.preventDefault();
    event.stopPropagation();

    if (!TIMER) {
      const { src, width, height } = event.target as HTMLImageElement;
      TIMER = setTimeout(() => {
        TIMER = null;

        const imageElement = document.createElement("img");
        imageElement.src = src;

        chrome.storage.sync.get("token", async ({ token }) => {
          try {
            const { status } = await postImage(src, token);
            if (status === 201) {
              proceedPick(imageElement, src, width, height);
            }
          } catch (e) {
            console.log(e);
            alert("저장 실패");
          }
          chrome.runtime.sendMessage({ isPickMode: false });
        });
      }, 500);
    }
  }
}

const postImage = async (src: string, token: string) =>
  await post("/api/storage-photos", {
    uri: src,
    representativeColor: "representativeColor"
  }, token)

const proceedPick = (imageElement: HTMLImageElement, src: string, width: number, height: number) => {
  setStyle(imageElement);
  fadeIn(imageElement, slideOut);
  document.body.appendChild(imageElement);
  chrome.storage.local.get("images", ({ images }) => {
    if (images) {
      chrome.storage.local.set({
        images: images.concat({ src, width, height }).slice(-20)
      });
      return;
    }
    chrome.storage.local.set({ images: [{ src, width, height }] });
  });
  chrome.runtime.sendMessage({ isPickMode: false });
}

const setStyle = ({ style }: HTMLImageElement) => {
  style.position = "fixed";
  style.zIndex = "50";
  style.right = "0";
  style.top = "0";
  style.margin = "0.5rem";
  style.maxWidth = "10rem";
  style.maxHeight = "8rem";
  style.border = "0.3rem solid black";
  style.borderRadius = "0.5rem";
  style.backgroundColor = "#FFFFFF";
}

const fadeIn = (element: HTMLImageElement, callback: (it: HTMLImageElement) => void) => {
  const ms = 600;
  const finishFadeIn = () => {
    element.removeEventListener("transitionend", finishFadeIn);
    setTimeout(() => callback(element), 2000);
  };
  element.style.transition = "opacity 0s";
  element.style.display = "";
  element.style.opacity = "0";
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      element.addEventListener("transitionend", finishFadeIn);
      element.style.transition = `opacity ${ms / 1000}s`;
      element.style.opacity = "1"
    });
  });
};

const slideOut = (element: HTMLImageElement) => {
  let marginValue = 0.5;
  let fps = 120;

  const moveRight = () => {
    setTimeout(() => {
      marginValue -= 0.4;
      element.style.marginRight = marginValue + "rem";
      requestAnimationFrame(moveRight);
      if (element.x > document.body.clientWidth) {
        document.body.removeChild(element);
      }
    }, 1000 / fps);
  }
  requestAnimationFrame(moveRight);
}
