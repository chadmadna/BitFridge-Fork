import _ from 'lodash'
import { browserHistory } from 'react-router'
import defaults from './config/defaultStates'
import { VIEW_THRESHOLD } from './config/constants'
import uiUtils from './utils/ui'
import constants from './constants'

function reducer(state = defaults, action) {
  let newSearch, newFridge, newRecipes, newCookingToday, newContents, 
    newUserData, newErrorType, newState
  switch (action.type) {

    /** SEARCH **/
    case constants.UPDATE_SEARCH_TEXT:
      newSearch = {
        ...state.search,
        searchText: action.searchText
      }
      return { ...state, search: newSearch }

    case constants.REQUEST_SEARCH:
      newSearch = {
        ...state.search,
        isLoading: true,
        timestamp: action.timestamp
      }
      return { ...state, search: newSearch }

    case constants.RECEIVE_SEARCH:
      if (action.timestamp === state.search.timestamp) {
        newSearch = {
          ...state.search,
          isLoading: false,
          contents: action.suggestions
        }
        newState = { ...state, search: newSearch }
      } else {
        newState = state
      }
      return newState

    case constants.TOGGLE_FOCUS:
      newSearch = { ...state.search, isFocused: !state.search.isFocused }
      return { ...state, search: newSearch }

    /** FRIDGE **/
    case constants.TOGGLE_ADD_DELETE:
      let message
      switch (action.ingredient.isAdded) {
        case false:
          newContents = [...state.fridge.contents, action.ingredient]
          newFridge = { ...state.fridge, contents: newContents }
          message = 'Added ingredient to fridge!'
          if (!state.shouldTransition) {
            uiUtils.tooltips.showTooltip(
              action.ingredient.idName,
              message
            )
          }
          return { ...state, fridge: newFridge }
        case true:
          const index = _.findIndex(state.fridge.contents,
            i => i.id === action.ingredient.id)
          newContents = [
            ...state.fridge.contents.slice(0, index),
            ...state.fridge.contents.slice(index + 1)
          ]
          newFridge = { ...state.fridge, contents: newContents }
          message = 'Deleted ingredient from fridge!'
          if (!state.shouldTransition) {
            uiUtils.tooltips.showTooltip(
              action.ingredient.idName,
              message
            )
          }
          return { ...state, fridge: newFridge, message }
        default: return state  // not gonna happen unless errored
      }

    /** RECIPES **/
    case constants.REQUEST_RECIPES:
      newRecipes = {
        ...state.recipes,
        timestamp: action.timestamp,
        isLoading: true
      }
      return { ...state, recipes: newRecipes }
    case constants.RECEIVE_RECIPES:
      if (action.timestamp === state.recipes.timestamp) {
        const results = [...state.recipes.contents, action.recipes]
        newRecipes = {
          ...state.recipes,
          contents: results,
          isLoading: false
        }
        newState = { ...state, recipes: newRecipes }
      } else {
        newState = state
      }
      return newState

    case constants.MORE_RECIPES:
      newRecipes = { ...state.recipes, page: state.recipes.page + 1 }
      return { ...state, recipes: newRecipes }

    case constants.RETRY_RECIPES:
      newRecipes = { ...state.recipes, contents: [], page: 1 }
      return { ...state, recipes: newRecipes }

    /** COOKING TODAY **/
    case constants.ADD_TO_COOKING_TODAY:
      newContents = [...state.cookingToday.contents, action.recipe]
      newCookingToday = { ...state.cookingToday, contents: newContents }
      return { ...state, cookingToday: newCookingToday }

    case constants.TOGGLE_COOKING_TODAY:
      const isExpanded = !state.accordion.isExpanded || state.accordion.id !== action.index
      index = action.index
      const newAccordion = { isExpanded, index }
      newCookingToday = { ...state.cookingToday, accordion: newAccordion }
      return { ...state, cookingToday: newCookingToday }

    case constants.CLEAR_COOKING_TODAY:
      newCookingToday = { ...state.cookingToday, contents: [] }
      return { ...state, cookingToday: newCookingToday }

    case constants.UPDATE_MISSING_COOKING_TODAY:
      const missingIngredients = state.cookingToday.contents.map(
        recipe => recipe.missedIngredients
      )
      const results = missingIngredients.map(missed =>
        _.differenceBy(missed, action.fridge, 'id')
      )
      newContents = state.cookingToday.contents.map(function (ingredients, i) {
        ingredients.missedIngredients = results[i]
        return ingredients
      })
      newCookingToday = { ...state.cookingToday, contents: newContents }
      return { ...state, cookingToday: newCookingToday }

    /** USER DATA **/
    case constants.REQUEST_USER_DATA:
      newUserData = {
        ...state.userData,
        isLoading: true,
        timestamp: action.timestamp
      }
      return { ...state, newUserData }

    case constants.RECEIVE_USER_DATA:
      if (action.timestamp === state.userData.timestamp) {
        newUserData = { ...state.userData, isLoading: false, user: action.userData.user }
        newState = { ...state, newUserData }
      } else {
        newState = state
      }
      return newState

    case constants.SEND_SYNC:
      newUserData = { ...state.userData, didInvalidate: true }
      return { ...state, newUserData }

    case constants.ACK_SYNC:
      newUserData = { ...state.userData, didInvalidate: false }
      return { ...state, newUserData }

    /** DISPLAY **/
    case constants.TRANSITION_DISPLAY:
      const [ display, nextPath ] =
        action.pathname === '/'
          ? [ 'index', '/dash' ]
        : action.pathname === '/dash'
          ? [ 'dash', '/' ]
          : [ null, null ]
      const fridgeLength = state.fridge.contents.length
      const shouldTransition =
        (fridgeLength === VIEW_THRESHOLD - 1 && display === 'index') ||
        (fridgeLength === VIEW_THRESHOLD && display === 'dash')
      if (shouldTransition) {
        browserHistory.push(nextPath)
      }
      return { ...state, display, shouldTransition }

    /** READY **/
    case constants.SET_READY:
      return { ...state, ready: true }

    /** ERROR HANDLER **/
    case constants.HANDLE_ERROR:
      newErrorType = {
        ...state.errorType,
        [action.component]: action.error
      }
      return { ...state, errorType: newErrorType }
    case constants.CLEAR_ERROR:
      newErrorType = {
        ...state.errorType,
        [action.component]: null
      }
      return { ...state, errorType: newErrorType }

    default: return state
  }
}

export default reducer
