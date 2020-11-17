export default function convertTime(timeMinute){
  if (timeMinute < 60){
    return timeMinute + " min";
  }else{
    let hours = Math.floor(timeMinute/60);
    let minutes = timeMinute - hours * 60;
    if (minutes > 0){
      return hours + (hours ===1 ? " hour " : " hours ")  + minutes + " min";
    } else{
      return hours + (hours ===1 ? " hour " : " hours ");
    }
  }
};
