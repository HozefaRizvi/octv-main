export  const parseVTT = (vttText) => {
    const lines = vttText.split("\n").map(line => line.trim()).filter(line => line); // Clean empty lines
    if (lines[0].startsWith("WEBVTT")) lines.shift(); // Remove WEBVTT header

    const chaptersArray = [];
    let i = 0;

    while (i < lines.length) {
      if (!isNaN(lines[i])) { // Check if it's a numeric ID
        const id = lines[i]; // e.g., "1"
        i++;
        const timeRange = lines[i]; // e.g., "00:10:00.000 --> 00:20:00.000"
        i++;
        const title = lines[i]; // e.g., "chapter"
        i++;

        const [startTime] = timeRange.split(" --> "); // Extract start time
        chaptersArray.push({
          id,
          title,
          startTime: timeToSeconds(startTime),
        });
      } else {
        i++;
      }
    }

    console.log("Parsed Chapters:", chaptersArray);
    return chaptersArray;
  };
export const  timeToSeconds = (time) => {
    const parts = time.split(":");
    return parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseFloat(parts[2]);
  }; 

  export   const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };