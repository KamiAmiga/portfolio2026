<template>
<h1 class="font-sans--3xl heading heading--main heading--main-v1">Test heading main</h1>
<h2 class="font-sans--2xl heading heading--second heading--second-v2">Subtitle</h2>
</template>

<style lang="scss">
.test {
  padding-block: 30vh;
}

.heading {
  text-shadow: 
    0
    0 
    .25em 
    color-mix(
      in srgb,
      transparent var(--opacity-percentage-6),
      var(--color-primary-reverse)
    );
    
  &--main {
    width: fit-content;
    padding: var(--spacer-sm) var(--spacer-lg) var(--spacer-sm) var(--spacer-2xl);
    position: relative;

    &-v1 {
      background: linear-gradient(
        60deg,
        color-mix(
          in srgb,
          transparent var(--opacity-percentage-6),
          var(--color-secondary-darker)
        ),
        var(--spacer-3xl),
        color-mix(
          in srgb,
          transparent var(--opacity-percentage-9),
          var(--color-secondary-darker)
        ) 80%
      );
  
      &::before {
        content: "";
        position: absolute;
        inset: 2px;
        border: 1px solid color-mix(
          in srgb,
          transparent var(--opacity-percentage-8),
          var(--color-secondary-lighter)
        );
      }
  
      &::after {
        content: "";
        display: block;
        width: min(33%, var(--spacer-3xl));
        height: var(--spacer-xs);
        position: absolute;
        left: 0;
        top: 100%;
        background-color: var(--color-secondary-lighter);
      }
    }
  }

  &--second {
    width: fit-content;
    position: relative;

    &-v1 {
      border-bottom: 2px solid color-mix(
        in srgb,
        transparent var(--opacity-percentage-6),
        var(--color-secondary-base)
      );

      &::before {
        content: "";
        position: absolute;
        inset-inline: var(--spacer-xs);
        bottom: -2px;
        border: 2px solid color-mix(
          in srgb,
          transparent var(--opacity-percentage-6),
          var(--color-secondary-base)
        );
        filter: blur(var(--spacer-xs));
      }
    }

    &-v2 {
      // TODO: focus effect
      padding: var(--spacer-xs) var(--spacer-xl) var(--spacer-xs) var(--spacer-md);
      background: linear-gradient(
        90deg,
        color-mix(
          in srgb,
          transparent var(--opacity-percentage-3),
          var(--color-secondary-darker)
        ),
        var(--spacer-md),
        color-mix(
          in srgb,
          transparent var(--opacity-percentage-9),
          var(--color-secondary-darker)
        ) 80%
      );

      &::before {
        content: "";
        position: absolute;
        inset: -1px;
        border: 2px solid color-mix(
          in srgb,
          transparent var(--opacity-percentage-8),
          var(--color-secondary-lighter)
        );
      }
    }
  }
}
</style>