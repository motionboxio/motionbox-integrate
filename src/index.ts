import { IOptions } from "./types";

const getEnv = (env?: "production" | "staging" | "development") => {
  if (env === "production")
    return {
      main: "https://motionbox.io",
      prisma: "https://prisma-production.vercel.app",
    };

  if (env === "staging")
    return {
      main: "https://staging.motionbox.io",
      prisma: "https://prisma-staging.vercel.app",
    };

  if (env === "development")
    return {
      main: "http://localhost:3000",
      prisma: "http://localhost:3001",
    };

  return {
    main: "https://staging.motionbox.io",
    prisma: "https://prisma-staging.vercel.app",
  };
};

// https://jsfiddle.net/7to3180q/1/
(window as any).closeMotionbox = () =>
  (document as any).getElementById("Motionbox").remove();

(window as any).openMotionbox = async (options: IOptions) => {
  const GRAPHQL_ENDPOINT = `${getEnv(options.env).prisma}/api`;

  const fetchSubUser = async ({ token, userId }: any) => {
    try {
      const GET_SUBUSER = `
        query ($id: ID!) {
          subUser {
            id
            projects {
              id
              title
              thumbnail
              userVideos {
                id
                data
                boarddimensions
              }
            }
          }
        }
      `;

      const CREATE_SUBUSER = `
        mutation ($id: ID!) {
          createSubUser(id: $id) {
            id
            projects {
              id
              title
              thumbnail
              userVideos {
                id
                data
                boarddimensions
              }
            }
          }
        }
      `;

      const getRes = await fetch(GRAPHQL_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          authorization: token,
        },
        body: JSON.stringify({
          query: GET_SUBUSER,
          variables: {
            id: userId,
          },
        }),
      });

      const getData = await getRes.json();

      console.log({
        getData,
      });

      if (!getData.data.user) {
        // create user
        const createRes = await fetch(GRAPHQL_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            authorization: token,
          },
          body: JSON.stringify({
            query: CREATE_SUBUSER,
            variables: {
              id: userId,
            },
          }),
        });

        const createData = await createRes.json();

        console.log({
          createData,
        });

        return createData.data.user;
      } else {
        return getData.data.user;
      }
    } catch (e) {
      throw new Error(
        `Error fetching video ${e} ${Object.getOwnPropertyNames(e)}`
      );
    }
  };

  const mbWrapper: HTMLDivElement = document.createElement("div");
  const closeButton = document.createElement("div");
  const mbLogo = document.createElement("div");
  const spinner = document.createElement("div");
  const iframe = document.createElement("iframe");

  mbWrapper.id = "Motionbox";
  closeButton.id = "Motionbox-Close-Button";
  mbLogo.id = "Motionbox-Logo";
  spinner.id = "Motionbox-Spinner";

  const style = `
    #Motionbox.loaded iframe,
    #Motionbox.loaded #Motionbox-Close-Button {
      opacity: 1;
    }
    #Motionbox.loaded #Motionbox-Logo {
      display: none;
    }
    #Motionbox iframe {
      opacity: 0;
    }
    #Motionbox {
      position: fixed;
      margin: auto;
      display: flex;
      align-items: center;
      justify-content: center;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      padding: 40px;
      box-sizing: border-box;
    }
    #Motionbox:before {
      content: "";
      background: rgba(52, 59, 78, 0.6);
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      z-index: -1;
    }
    #Motionbox iframe { 
      width: 100%;
      height: 100%;
      border: 1px solid #e1e4e8;
      border-radius: 6px;
    };
    #Motionbox body { height: 100%; }
    #Motionbox-Close-Button {
      opacity: 0;
      position: absolute;
      top: 12px;
      right: 15px;
      cursor: pointer;
    }
    #Motionbox-Close-Button svg path {
      fill: #fff;
    }
    #Motionbox-Logo,
    #Motionbox-Spinner {
      display: block;
      position: absolute;
      margin: auto;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
    }
    #Motionbox-Spinner {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    #Motionbox-Logo {
      width: 10%;
      height: 10%;
    }
    #Motionbox-Logo svg {
      width: 100%;
    }
    #Motionbox-Logo .st0 {
      fill: #1055fa;
    }
    #Motionbox-Logo .st1 {
      fill: #2ba2f7;
    }
    #Motionbox-Logo .st2 {
      fill: #ffffff;
    }
    .animate-spin {
      animation: spin 1s linear infinite;
    }
    .text-white {
      color: #ffffff;
    }
    .w-5 {
      width: 1.25rem;
    }
    .h-5 {
      height: 1.25rem;
    }
    .m-auto {
      margin: auto !important;
    }
    .opacity-25 {
      opacity: 0.25 !important;
    }
    .opacity-75 {
      opacity: 0.75 !important;
    }
    @keyframes spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
  `;

  closeButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M13.06 12.15l5.02-5.03a.75.75 0 1 0-1.06-1.06L12 11.1 6.62 5.7a.75.75 0 1 0-1.06 1.06l5.38 5.38-5.23 5.23a.75.75 0 1 0 1.06 1.06L12 13.2l4.88 4.87a.75.75 0 1 0 1.06-1.06l-4.88-4.87z"
      ></path>
    </svg>
  `;

  mbLogo.innerHTML = `
    <svg id="Layer_1" style="width:30px" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 125.32 125.15">
      <g id="Logo">
        <g id="Cube">
          <g id="Back">
            <path d="M36,107A23.64,23.64,0,0,1,12.44,83.46V33.6A23.6,23.6,0,0,1,36,10H84.86A23.68,23.68,0,0,1,108.44,33.6V83.46A23.6,23.6,0,0,1,84.86,107Z" transform="translate(-6.44 -4.03)" fill="#2861f0"></path>
            <path d="M84.86,16A17.68,17.68,0,0,1,102.44,33.6V83.46A17.63,17.63,0,0,1,84.86,101H36a17.38,17.38,0,0,1-4.7-.66A17.62,17.62,0,0,1,18.44,83.46V33.6A17.62,17.62,0,0,1,36,16H84.86m0-12H36A29.6,29.6,0,0,0,6.44,33.6V83.46A29.63,29.63,0,0,0,36,113H84.86a29.61,29.61,0,0,0,29.58-29.57V33.6A29.68,29.68,0,0,0,84.86,4Z" transform="translate(-6.44 -4.03)" fill="#2861f0"></path>
          </g>
          <g id="Middle">
            <path d="M43.5,119.07c-1.47,0-4.53,0-16.14-10.48-12.22-11-12.22-15.06-12.22-17a7.05,7.05,0,0,1,2.94-5.81,7.66,7.66,0,0,1,3.42-1.36V41.38A23.6,23.6,0,0,1,45.07,17.81H88.76a7.51,7.51,0,0,1,.47-.68,7,7,0,0,1,5.5-2.63c3.9,0,7.67,2.86,14.65,9.27.64.59,1.19,1.1,1.63,1.48,7.75,6.8,12.67,11.67,10.59,17.19a7,7,0,0,1-4.1,4.11V91.24a23.59,23.59,0,0,1-23.57,23.57H49.45q-.11.3-.24.6A6.26,6.26,0,0,1,43.5,119.07Z" transform="translate(-6.44 -4.03)" fill="#2861f0"></path>
            <path d="M94.73,20.5c2.68,0,9.65,6.91,12.32,9.26,12,10.58,10.16,11.63,4.93,11.63h-.48V91.24a17.62,17.62,0,0,1-17.57,17.57H45.07c-1.23,0-3.89-1-4.66-1-.24,0-.29.11,0,.39,3.12,3.51,3.86,4.92,3.13,4.92C40.58,113.07,14,90.31,23,90.32a15.84,15.84,0,0,1,4.49.92V41.38A17.63,17.63,0,0,1,45.07,23.81H93.93c-.58-2.39-.18-3.31.8-3.31m0-12h0A13,13,0,0,0,86,11.81H45.07A29.61,29.61,0,0,0,15.5,41.38V80.29A12.91,12.91,0,0,0,10.9,85c-1.48,2.56-3.36,7.88.61,14.77,3,5.12,9.18,11.05,13.89,15.12,10.91,9.44,14.65,10.21,18.1,10.21a12.3,12.3,0,0,0,9.31-4.26H93.93A29.6,29.6,0,0,0,123.5,91.24V49.85a13,13,0,0,0,3.71-5.29c1.89-5,.69-10.15-3.56-15.29A80.38,80.38,0,0,0,115,20.74c-.41-.36-.93-.84-1.53-1.39C106.3,12.8,101.14,8.5,94.73,8.5Z" transform="translate(-6.44 -4.03)" fill="#2861f0"></path>
          </g>
          <g id="Front">
            <path d="M53.33,123.18a23.29,23.29,0,0,1-6.32-.89A23.65,23.65,0,0,1,29.76,99.61V49.75A23.59,23.59,0,0,1,53.33,26.18h48.86a23.66,23.66,0,0,1,23.57,23.57V99.61a23.61,23.61,0,0,1-23.57,23.57Z" transform="translate(-6.44 -4.03)" fill="#fff"></path>
            <path d="M102.19,32.18a17.66,17.66,0,0,1,17.57,17.57V99.61a17.63,17.63,0,0,1-17.57,17.57H53.33a17.38,17.38,0,0,1-4.7-.66A17.64,17.64,0,0,1,35.76,99.61V49.75A17.62,17.62,0,0,1,53.33,32.18h48.86m0-12H53.33A29.6,29.6,0,0,0,23.76,49.75V99.61a29.68,29.68,0,0,0,21.63,28.46,29.31,29.31,0,0,0,7.94,1.11h48.86a29.61,29.61,0,0,0,29.57-29.57V49.75a29.66,29.66,0,0,0-29.57-29.57Z" transform="translate(-6.44 -4.03)" fill="#2861f0"></path>
          </g>
        </g>
        <g id="Letter">
          <path d="M49.87,90l-1.61,6h14.2l1.6-6Zm43-37.41L79.44,67.79l-5.2-15.25H59.92L52.09,81.69H66.27l2-7.27,5.83,15.44h.25L88.43,74.42,82.67,95.93H97.11l11.66-43.39Z" transform="translate(-6.44 -4.03)" fill="#2861f0"></path>
        </g>
      </g>
    </svg>
  `;

  spinner.innerHTML = `
    <svg
      class="animate-spin m-auto h-5 w-5 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
      class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      ></circle>
      <path
      class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  `;

  document.head.insertAdjacentHTML("beforeend", `<style>${style}</style>`);
  mbWrapper.append(iframe);
  mbWrapper.append(closeButton);
  // mbWrapper.append(mbLogo);
  mbWrapper.append(spinner);

  document.body.append(mbWrapper);
  mbWrapper.onclick = (window as any).closeMotionbox;
  closeButton.onclick = (window as any).closeMotionbox;

  try {
    // fetchSubUser
    const subUser = await fetchSubUser({
      token: options.token,
      userId: options.userId,
    });

    console.log({
      subUser,
    });

    iframe.src = `${getEnv(options.env).main}/creator/${options.userId}`;

    iframe.onload = () => {
      spinner.remove();
      mbWrapper.classList.add("loaded");

      if (iframe?.contentWindow) {
        iframe.contentWindow.postMessage(
          {
            token: options.token ? options.token : "",
            onDone: options.onDone ? true : "",
            subUser,
            uiConfig: options.uiConfig,
            isMotionbox: true,
          },
          "*"
        );
      } else {
        console.log("iframe.contentWindow is null");
      }
    };

    const receiveMessage = (event: MessageEvent<any>) => {
      options.onDone &&
        options.onDone({
          link: event.data.link,
        });
    };

    window.addEventListener("message", receiveMessage, false);
  } catch (e: any) {
    throw new Error(
      `Error opening Motionbox ${e} ${Object.getOwnPropertyNames(e)}`
    );
  }
};
