export function matchKorean(target, query) {
  if (!query) return true
  
  // 1. 일반 문자열 포함 여부 (ex: "서울"에 "서"가 포함되는지)
  if (target.includes(query)) return true

  // 2. 초성 검색 지원 (ex: "서울" -> "ㅅㅇ")
  const CHOSUNG = ["ㄱ","ㄲ","ㄴ","ㄷ","ㄸ","ㄹ","ㅁ","ㅂ","ㅃ","ㅅ","ㅆ","ㅇ","ㅈ","ㅉ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"]
  
  const getChosung = (str) => {
    let result = ""
    for(let i = 0; i < str.length; i++) {
      const code = str.charCodeAt(i) - 44032
      if(code > -1 && code < 11172) {
        result += CHOSUNG[Math.floor(code / 588)]
      } else {
        result += str.charAt(i)
      }
    }
    return result
  }

  // 검색어가 모두 초성으로만 이루어져 있는지 확인 ("ㅅ", "ㅅㅇ" 등)
  const isOnlyChosung = /^[ㄱ-ㅎ]+$/.test(query)
  if (isOnlyChosung) {
    return getChosung(target).includes(query)
  }

  return false
}
