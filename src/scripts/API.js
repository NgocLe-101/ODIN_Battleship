const ERROR_CODE = {
  200: "OK",
  400: "Bad Request",
  404: "Not found",
  500: "Internal server error",
};

function wrapAPI(object) {
  return Object.assign(
    {
      status: 200,
      ok: true,
      message: ERROR_CODE[200],
    },
    object
  );
}

function wrapErrorAPI(object, errorCode) {
  return Object.assign(
    {
      status: errorCode,
      ok: errorCode === 200 ? true : false,
      message: ERROR_CODE[errorCode],
    },
    object
  );
}

export { wrapAPI, wrapErrorAPI };
