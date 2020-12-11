export default function getTimePassed(timestamp) {
  const timestampPassed = Date.now() - timestamp

  const daysPassed = timestampPassed / (1000 * 60 * 60 * 24)

  if (isNaN(daysPassed)) {
    return null
  } else if (daysPassed >= 1) {
    return {
      n: parseInt(daysPassed),
      unit: "d",
    }
  } else {
    const hoursPassed = timestampPassed / (1000 * 60 * 60)

    if (isNaN(hoursPassed)) {
      return null
    } else if (hoursPassed >= 1) {
      return {
        n: parseInt(hoursPassed),
        unit: "h",
      }
    } else {
      const minutesPassed = timestampPassed / (1000 * 60)

      if (isNaN(minutesPassed)) {
        return null
      } else {
        return {
          n: parseInt(minutesPassed),
          unit: "m",
        }
      }
    }
  }
}
