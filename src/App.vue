<script setup>
import { ref } from 'vue'
import IconDelete from './components/PopIcons/IconDelete.vue'
import IconArrowBT from './components/PopIcons/IconArrowBT.vue'
import IconPlus from './components/PopIcons/IconPlus.vue'
import IconCheck from './components/PopIcons/IconCheck.vue';
import { createClient } from '@supabase/supabase-js'
const supabase = createClient('https://smpdmmmzpjbmzmegfosy.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtcGRtbW16cGpibXptZWdmb3N5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTM4NjEwNTUsImV4cCI6MjAwOTQzNzA1NX0.qy4oAQUuNHResYjo5w4YXhDuSoVu2A5Jbz0tU5eO_9k')

const list = ref([])

async function getList(){
  try {
    let { data: ToDoList, error } = await supabase
    .from('ToDoList')
    .select('task_name,id')
    if (error) throw error
    ToDoList.forEach(element => {
      list.value.push(element)
    })
  } catch(error) {
    console.log(error.message)
  }
}

getList()

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
document.addEventListener('DOMContentLoaded', function () {
  switchDarkTheme()
})

async function pushToList() {
  const Title = document.querySelector('#TaskName')
  if (!Title.value) return alert('Fill the input field to name a new task')
  try {
    const { data, error } = await supabase
    .from('ToDoList')
    .insert([
      { task_name: Title.value },
    ])
    .select()
    if (error) throw error
    console.log(data)
    list.value.push({task_name: data[0].task_name, id: data[0].id})
    Title.value = null
  } catch (error) {
    console.log(error.message)
  }
}

async function deleteFromList(index, key) {
  try {
    const { error } = await supabase
    .from('ToDoList')
    .delete()
    .eq('id', key)
    console.log(key);
    if (error) throw error
    list.value.splice(index, 1)
  } catch (error) {
    console.log(error.message)
  }
}

function editFromList(index) {
  currentEdit.value = index
}


async function saveOnList(index, key) {
  const input = document.getElementById(index + '_input')
  if (!input.value) return alert('Fill the edition field to name a new task')
  try {
  const { data, error } = await supabase
  .from('ToDoList')
  .update({ task_name: input.value })
  .eq('id', key)
  .select()
  if (error) throw error
  console.log(data)
  list.value[index].task_name = input.value

  } catch (error) {
    console.log(error.message);
  }


  currentEdit.value = null
}
</script>

<template>
  <main id="Main"
    class="relative w-full h-screen m-auto border-x-2 border-gray-800 dark:text-white dark:border-white max-w-md z-20 flex flex-col justify-between"
  >
    <h1 class="hidden">you will never see this</h1>

    <section class="px-10 pt-10 w-full max-h-screen overflow-y-scroll">
      <h1 class="text-lg">Today I will...</h1>

      <div class="w-full h-0.5 bg-gray-800 dark:bg-white"></div>

      <ul class="list-none list-inside">
        <li
          v-for="(item, index) in list"
          :key="index"
          class="relative my-3 w-full flex gap-3 items-center justify-evenly"
          v-motion
          :initial="{ opacity: 0, x: -100 }"
          :enter="{ opacity: 1, x: 0, scale: 1 }"
          :delay="50 * (index + 1)"
        >
          <IconArrowBT
            :color="color"
            class="inline m-2 transition-all"
            v-motion
            :initial="{ x: -50, opacity: 0, rotate: '90deg' }"
            :enter="{ x: 0, opacity: 1 }"
            :delay="50 * (index + 1)"
          />
          <div class="flex-grow"
          @click="editFromList(index)"
          >

            <span
            :id="index + '_span'"
            :class="{ hidden: currentEdit == index }"
            >{{ item.task_name }}</span>
          </div>

          <input
            :id="index + '_input'"
            :class="{ hidden: !(currentEdit == index) }"
            class="py-2 px-6 bg-transparent border-2 rounded-full w-full"
            v-motion
            :initial="{ scaleX: 0.1 }"
            :visible="{ scaleX: 1 }"
            @keypress.enter="saveOnList(index, item.id)"
          />
          <button
            @click="saveOnList(index, item.id)"
            type="button"
            class="relative border-inherit border-2 rounded-full h-10 aspect-square text-3xl"
            :class="{ hidden: !(currentEdit == index) }"
          >
            <IconCheck 
              :color="color"
              class="m-2 transition-all" 
            />
          </button>

          <div
            :id="index + '_div'"
            :class="{ hidden: currentEdit == index }"
            class="bottom-0 right-0 flex gap-1"
          >
            <button class="rounded-lg w-7 aspect-square m-auto" @click="deleteFromList(index, item.id)">
              <IconDelete class="m-auto" :color="color" />
            </button>
          </div>
        </li>
      </ul>
    </section>

    <section class="bg-gradient-to-t from-gray-400 dark:from-gray-900 to-transparent w-full px-10 py-5 border-inherit flex gap-2">
      <input
        id="TaskName"
        placeholder=" . . . "
        @keypress.enter="pushToList()"
        class="py-2 px-6 bg-transparent border-2 border-inherit rounded-full flex-grow"
      />
      <button
        @click="pushToList()"
        type="button"
        class="relative border-inherit border-2 rounded-full h-10 aspect-square text-3xl"
      >
        <IconPlus :color="color" class="m-auto" />
      </button>
    </section>
  </main>
</template>
<style>
::-webkit-scrollbar {
  background: transparent;
  margin: 3em
}
::-webkit-scrollbar-thumb {
  background: white;
  border-top-left-radius: 9999px;
  border-bottom-left-radius: 9999px;
}
::-webkit-scrollbar-track-piece{
  margin-top: 5em;
}
</style>
