<script setup>
import { ref } from 'vue'
import IconDelete from './components/PopIcons/IconDelete.vue'
import IconArrowBT from './components/PopIcons/IconArrowBT.vue'
import IconPlus from './components/PopIcons/IconPlus.vue'

const list = ref([
  "Acordar",
  "Levantar",
  "Tomar café",
  "Deitar",
])

const currentEdit = ref(null)

const color = ref()

/**
 * Sets the same color of the borders to the SVGs 
 * This is a complete mess. but it works 👍
 */
function switchDarkTheme() {
  var main = document.querySelector('main')
  var style = window.getComputedStyle(main)
  color.value = style.getPropertyValue('border-color')
}
document.addEventListener('DOMContentLoaded', function() {
  switchDarkTheme()
})

function pushToList(){
  const Title = document.querySelector('#TaskName')
  if (!Title.value) return alert('Preencha o campo de texto para adicionar uma tarefa.')
  list.value.push(Title.value)
  Title.value = null
}

function deleteFromList(index) {
  list.value.splice(index,1)
}

function editFromList(index){
  currentEdit.value = index
}

function saveOnList(index) {
  const input = document.getElementById(index+'_input')
  if (!input.value) return alert('Preencha o campo de edição da tarefa.')
  list.value[index] = input.value
  currentEdit.value = null
}
</script>

<template>
  <main id="Main" class="relative w-full h-screen m-auto border-x-2 border-gray-800 dark:text-white dark:border-white max-w-md z-20 flex flex-col justify-between">
    
    <h1 class="hidden">you will never see this</h1>

    <section class="px-10 pt-10 w-full max-h-screen overflow-y-scroll">
      <h1 class="text-lg">Eu ainda preciso...</h1>
      
      <div class="w-full h-0.5 bg-gray-800 dark:bg-white"></div>
      
      <ul class="list-none list-inside">
        <li 
          v-for="(item, index) in list" 
          :key="index" 
          class="relative my-3" 
          v-motion
          :initial="{ opacity: 0, x: -100 }"
          :enter="{ opacity: 1, x: 0, scale: 1 }"
          :delay="100*(index+1)"
        >
          <IconArrowBT
            :color="color"
            class="inline m-2 transition-all" 
            v-motion
            :initial="{x:-50, opacity: 0, rotate: '90deg' }"
            :enter="{x: 0, opacity: 1}"
            :delay="100*(index+1)"
          />
          <span :id="index+'_span'" :class="{hidden: (currentEdit == index)}" @click="editFromList(index)">{{ item }}</span>
          
          <input
            :id="index+'_input'"
            :class="{hidden: !(currentEdit == index)}"
            class="py-2 px-6 bg-transparent border-2 rounded-full"
            v-motion
            :initial="{ scaleX: .1 }"
            :visible="{ scaleX: 1}"
            @keypress.enter="saveOnList(index)"
          >

          <div :id="index+'_div'" :class="{hidden: (currentEdit == index)}" class="absolute bottom-0 right-0 flex gap-1">
            <button class="rounded-lg w-7 aspect-square" @click="deleteFromList(index)">
              <IconDelete class="m-auto" :color="color" />
            </button>
          </div>
        </li>
      </ul>
    </section>

    <section class="bg-gray-400 dark:bg-gray-900 w-full px-10 py-5 border-inherit flex gap-2">
      <input id="TaskName" placeholder=" . . . " @keypress.enter="pushToList()"
        class="py-2 px-6 bg-transparent border-2 border-inherit rounded-full flex-grow">
      <button @click="pushToList()" type="button" class="relative border-inherit border-2 rounded-full h-10 aspect-square text-3xl">
        <IconPlus :color="color" class="m-auto" />
      </button>
    </section>

  </main>
</template>
<style>
::-webkit-scrollbar,::-webkit-scrollbar-thumb {
  background: none;
}
</style>