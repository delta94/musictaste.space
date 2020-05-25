import get from 'lodash/get'
import set from 'lodash/set'

export const getFromObject = (object: string) => (
  key: string
): null | string => {
  const dataObjStr = localStorage.getItem(object)
  if (!dataObjStr) {
    return null
  }
  const dataObj = JSON.parse(dataObjStr)
  return get(dataObj, key, null)
}

export const setIntoObject = (object: string) => (
  key: string,
  value: string
) => {
  const dataObjStr = localStorage.getItem(object)
  if (!dataObjStr) {
    const obj = { [key]: value }
    localStorage.setItem(object, JSON.stringify(obj))
    return
  }
  const dataObj = JSON.parse(dataObjStr)
  set(dataObj, key, value)
  localStorage.setItem(object, JSON.stringify(dataObj))
  return
}
