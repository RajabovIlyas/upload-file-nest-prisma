export type Config = {
  token: TokenConfig;
  encryption: EncryptionConfig;
};

export type TokenConfig = {
  refreshToken: {
    secret: string;
    expiresIn: string;
  };
  accessToken: {
    secret: string;
    expiresIn: string;
  };
};

export type EncryptionConfig = {
  secret: string;
  algorithm: string;
};
