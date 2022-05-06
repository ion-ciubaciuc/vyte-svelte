<div>
  <div class="spinner">
    <div class="bounce1" />
    <div class="bounce2" />
    <div class="bounce3" />
    <div class="bounce4" />
  </div>
</div>

<style>
  .spinner {
    margin: 30px auto;
    width: 100px;
    text-align: center;
  }

  .spinner > div {
    width: 10px;
    height: 10px;
    margin-right: 10px;
    background-color: #308ff0;

    border-radius: 100%;
    display: inline-block;
    -webkit-animation: bouncedelay 1.4s infinite ease-in-out;
    animation: bouncedelay 1.4s infinite ease-in-out;
    /* Prevent first frame from flickering when animation starts */
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
  }

  .spinner .bounce1 {
    -webkit-animation-delay: -0.48s;
    animation-delay: -0.48s;
    /* background-color: #14BC9B; */
  }

  .spinner .bounce2 {
    -webkit-animation-delay: -0.32s;
    animation-delay: -0.32s;
    /* background-color: #FCD436; */
  }

  .spinner .bounce3 {
    -webkit-animation-delay: -0.16s;
    animation-delay: -0.16s;
    /* background-color: #E76548; */
  }

  @-webkit-keyframes bouncedelay {
    0%,
    80%,
    100% {
      -webkit-transform: scale(0.5);
      opacity: 0.5;
    }
    40% {
      -webkit-transform: scale(1);
      opacity: 1;
    }
  }

  @keyframes bouncedelay {
    0%,
    80%,
    100% {
      transform: scale(0.5);
      -webkit-transform: scale(0.5);
      opacity: 0.5;
    }
    40% {
      transform: scale(1);
      -webkit-transform: scale(1);
      opacity: 1;
    }
  }
</style>
