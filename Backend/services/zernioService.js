import axios from "axios";

const ZERNIO_BASE_URL =
  process.env.ZERNIO_BASE_URL || "https://zernio.com/api/v1";

const zernio = axios.create({
  baseURL: ZERNIO_BASE_URL,
  headers: {
    Authorization: `Bearer ${process.env.ZERNIO_API_KEY}`,
    "Content-Type": "application/json",
  },
});

export const createZernioProfile = async ({
  name,
  description,
}) => {
  const response = await zernio.post("/profiles", {
    name,
    description,
  });

  return response.data;
};

export const getZernioConnectUrl = async ({
  platform,
  profileId,
  redirectUrl,
}) => {
  const response = await zernio.get(`/connect/${platform}`, {
    params: {
      profileId,
      redirect_url: redirectUrl,
    },
  });

  return response.data;
};

export const getZernioAccounts = async ({
  profileId,
}) => {
  const response = await zernio.get("/accounts", {
    params: {
      profileId,
    },
  });

  return response.data;
};

export const getZernioAccountHealth = async ({
  profileId,
}) => {
  const response = await zernio.get("/accounts/health", {
    params: {
      profileId,
    },
  });

  return response.data;
};

export const getZernioMediaUploadUrl = async ({
  filename,
  contentType,
  size,
}) => {
  const response = await zernio.post("/media/presign", {
    filename,
    contentType,
    size,
  });

  return response.data;
};

export const uploadToZernioStorage = async ({
  uploadUrl,
  buffer,
  contentType,
}) => {
  const response = await axios.put(uploadUrl, buffer, {
    headers: {
      "Content-Type": contentType,
    },
    maxBodyLength: Infinity,
  });

  return response;
};

export const createZernioPost = async ({
  content,
  mediaItems,
  platforms,
  publishNow = true,
  scheduledFor,
  timezone = "Asia/Karachi",
}) => {
  const body = {
    content,
    mediaItems,
    platforms,
    timezone,
  };

  if (scheduledFor) {
    body.scheduledFor = scheduledFor;
  } else {
    body.publishNow = publishNow;
  }

  const response = await zernio.post("/posts", body);

  return response.data;
};

export default zernio;