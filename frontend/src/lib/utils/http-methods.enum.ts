export const MethodsEnum = {
  GET: 'get',
  POST: 'post',
  DELETE: 'delete',
  PATCH: 'patch',
  PUT: 'put',
} as const;

export type MethodsEnum = (typeof MethodsEnum)[keyof typeof MethodsEnum];