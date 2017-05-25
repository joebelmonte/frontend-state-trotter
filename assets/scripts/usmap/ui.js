'use strict'

require('../jquery.vmap.js')
require('../jquery.vmap.usa.js')
const store = require('../store.js')
const formatDate = require('./formatDate.js')

// templates
const addItemToList = require('../templates/add-item-to-list.handlebars')
const allGoals = require('../templates/all-goals.handlebars')
const nextGoal = require('../templates/next-goal.handlebars')
const stateDefaultItem = require('../templates/state-default-item.handlebars')
const backToMapTemplate = require('../templates/back-to-map.handlebars')


const updateAfterEditFailure = (error) => {
  console.error(error)
}
const saveEditFailure = (error) => {
  console.error(error)
}

const hideMap = () => {
  $('#map-view-container').hide()
}

const getAttribute = ($button, array) => {
  const placeHolders = {}
  array.forEach((e) => {
    const val = $($button).attr(e)
    placeHolders[e] = val
  })
  return placeHolders
}

const getItemsSuccess = (data, region) => {
  store.state = region

  const filteredItems = data.items.filter((item) => {
    return item.state === region
  })
  hideMap()
  // 'item' below has to be 'item' in state-all-items.handlebars
  // We need to pass filteredItems to showStateView rather than data.items
  $('#state-header').text(store.state)
  $('#back-to-map-container').html(backToMapTemplate)
  // $('#back-to-map-button').on('click', goBacktoMap)
  return filteredItems
}

const getItemsFailure = (data) => {
  console.error(data)
  $('.status-message').text('Oops! Not able to retrieve your goals. Please try again.').show().fadeOut(3000)
}

const getmyGoalsSuccess = (data) => {

  const sortedData = data.items.sort(function (a, b) {
    a = new Date(a.due_date)
    b = new Date(b.due_date)
    return a > b ? 1 : a < b ? -1 : 0
  })

  const incompleteItems = sortedData.filter((item) => {
    return item.status === 'incomplete'
  })

  if (incompleteItems.length > 0) {
    const nextIncompleteItem = incompleteItems[0]

    nextIncompleteItem.due_date = formatDate(nextIncompleteItem.due_date)

    $('#next-goal').html(nextGoal({item: nextIncompleteItem}))
    $('#goal-column-0').empty()
    $('#goal-column-1').empty()
    $('#goal-column-2').empty()
    sortedData.forEach((item, i) => {
      if (i % 3 === 0) {
        $('#goal-column-0').append(allGoals({
          item: item
        }))
      } else if (i % 3 === 1) {
        $('#goal-column-1').append(allGoals({
          item: item
        }))
      } else if (i % 3 === 2) {
        $('#goal-column-2').append(allGoals({
          item: item
        }))
      }
    })
  } else {
    $('.userMessage').text('Add some goals before you sign out!').show().fadeOut(3000)
  }
}

const getmyGoalsFailure = (data) => {
  console.error(data)
  $('.userMessage').text('Oops! Not able to retrieve goals. Please try again.').show().fadeOut(3000)
}

const createItemSuccess = (data) => {
  store.currentItems.items.push(data.item)
  $('#create-item').remove()
  $('.userMessage').text('Goal added!').show().fadeOut(3000)
  return data
}

const createItemFailure = (data) => {
  console.error(data)
  $('.userMessage').text('Oops! Not able to add this goal. Please try again.').show().fadeOut(3000)
}

const getItemSuccess = (data) => {
  data.item.due_date = formatDate(data.item.due_date)
  data.item.createdAt = formatDate(data.item.createdAt)

  $('#create-item-container').html(stateDefaultItem({item: data.item}))
  $('.detail-header').text('Selected Item:')

  $('.userMessage').text('Check out your goal\'s details!').show().fadeOut(3000)
}

const getItemFailure = (data) => {
  console.error(data)
  $('.userMessage').text('Oops! Not able to show your goal\'s details. Please try again.').show().fadeOut(3000)
}

const updateItemSuccess = (data) => {
  $('.userMessage').text('You\'ve updated a goal!').show().fadeOut(3000)
}

const updateItemFailure = (data) => {
  console.error(data)
  $('.userMessage').text('Oops! This goal was not updated. Please try again.').show().fadeOut(3000)
}

const destroyItemSuccess = (data) => {
  $('.userMessage').text('You\'ve deleted a goal!').show().fadeOut('slow')
}

const destroyItemFailure = (data) => {
  console.error(data)
  $('.userMessage').text('Oops! This goal was not deleted. Please try again.').show().fadeOut(3000)
}

module.exports = {
  getItemsSuccess,
  getItemsFailure,
  createItemSuccess,
  createItemFailure,
  getItemSuccess,
  getItemFailure,
  updateItemSuccess,
  updateItemFailure,
  destroyItemFailure,
  destroyItemSuccess,
  getAttribute,
  getmyGoalsSuccess,
  getmyGoalsFailure,
  saveEditFailure,
  updateAfterEditFailure
}
