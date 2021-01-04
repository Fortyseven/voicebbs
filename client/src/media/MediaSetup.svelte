<script>
  export let isReady = false;
  export let streamObj = undefined;

  const constraintObj = {
    audio: true
  };

  if (navigator.mediaDevices === undefined) {
    new Error("Media access blocked, or unsupported on this browser");
  }

  navigator.mediaDevices
    .getUserMedia(constraintObj)
    .then(function(mediaStreamObj) {
      streamObj = mediaStreamObj;
      isReady = true;
    })
    .catch(function(err) {
      console.error(err.name, err.message);
    });
</script>
