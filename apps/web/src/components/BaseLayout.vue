<template>
  <div class="w-screen h-screen flex flex-col bg-[#F5F6F4]">
    <header class="flex justify-center items-center">
      <slot name="header"></slot>
    </header>
    <main class="grow-1">
      <slot></slot>
    </main>
    <footer class="sticky bottom-0">
      <slot name="footer"></slot>
    </footer>
  </div>
</template>
