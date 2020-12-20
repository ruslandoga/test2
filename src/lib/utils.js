import { Socket } from "phoenix";
import { goto } from "@sapper/app";

let socket;
let onboardingChannel;
let me;

export async function getSocket() {
  return socket || (await createSocket());
}

export function getMe() {
  return me;
}

async function init() {
  const res = await fetch("/api/me");
  const json = await res.json();

  me = json.me;
  const { next, token } = json;

  if (next === "blocked") {
    goto("/blocked");
    return;
  } else if (next === "onboarding") {
    if (!location.href.includes("onboarding")) {
      goto("/onboarding");
    }
  }

  socket = new Socket("/api/socket", {
    params: { token },
    logger: (kind, msg, data) => {
      console.log(`${kind}: ${msg}`, data);
    },
  });

  socket.onClose(() => {
    // TODO set error (show disconnected banner)
  });

  socket.connect();
}

async function createSocket() {
  await init();
  return socket;
}

export async function getOnboardingChannel() {
  return onboardingChannel || (await createOnboardingChannel());
}

async function createOnboardingChannel() {
  const socket = await getSocket();
  onboardingChannel = socket.channel(`onboarding:${me}`);
  onboardingChannel.join();
  return onboardingChannel;
}
