<template>
  <section>
    <p>
      Your value of breakpoint {{ $viewport.breakpoint.value }} is:
      <b>{{ $viewport.breakpointValue($viewport.breakpoint.value) }}</b>
    </p>
    <p>
      Your current breakpoint is: <b>{{ $viewport.breakpoint }}</b>
    </p>

    <div
      v-for="breakpoint in ['mobile', 'tablet', 'desktop']"
      :key="breakpoint"
    >
      <hr>

      <h4>{{ breakpoint }}</h4>

      <p>
        <code>match</code> → <b>{{ $viewport.match(breakpoint) }}</b>
      </p>
      <p>
        <code>isLessThan</code> → <b>{{ $viewport.isLessThan(breakpoint) }}</b>
      </p>
      <p>
        <code>isLessOrEquals</code> → <b>{{ $viewport.isLessOrEquals(breakpoint) }}</b>
      </p>
      <p>
        <code>isGreaterThan</code> → <b>{{ $viewport.isGreaterThan(breakpoint) }}</b>
      </p>
      <p>
        <code>isGreaterOrEquals</code> → <b>{{ $viewport.isGreaterOrEquals(breakpoint) }}</b>
      </p>
    </div>
  </section>
</template>

<style>
* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

html {
  font-family: sans-serif;
  font-size: 120%;
}

body {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

section {
  max-width: calc(100vw - 1rem);
  background: #eee;
  padding: 2rem;
  border-radius: 1rem;
}

hr {
  display: block;
  border: none;
  border-top: 0.1rem dashed #ccc;
  margin: 1rem auto;
}

p {
  margin: 0.5rem 0;
}

h4 {
  text-decoration: underline;
}

code {
  display: inline-block;
  padding: 0.25em 0.35rem;
  background: #ccc;
  border-radius: 0.25rem;
}
</style>
