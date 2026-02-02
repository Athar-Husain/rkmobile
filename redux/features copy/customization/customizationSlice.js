import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'
import config from '../../../config'

// import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isOpen: [],
    defaultId: 'default',
    // font_Family: config.fontFamily,
    // border_Radius: config.borderRadius,
    opened: true,
    drawerWidth: config.drawerWidth, // Define drawerWidth here
    gridSpacing: config.gridSpacing,
}

const customizationSlice = createSlice({
    name: 'customization',
    initialState,
    reducers: {
        // menu_Open(state, action) {
        //   state.isOpen = [action.payload]; // Update isOpen with the payload (id)
        // },
        // set_Menu(state, action) {
        //   state.opened = action.payload; // Update opened with the payload (boolean)
        // },
        // set_FontFamily(state, action) {
        //   state.fontFamily = action.payload; // Update fontFamily with the payload
        // },
        // set_BorderRadius(state, action) {
        //   state.borderRadius = action.payload; // Update borderRadius with the payload
        // }

        setMenuOpen(state, action) {
            state.isOpen = action.payload.isOpen
        },
        setMenuType(state, action) {
            state.navType = action.payload.navType
        },
    },
})

// export const { menu_Open, set_Menu, set_FontFamily, set_BorderRadius } = customizationSlice.actions;
// export const { menuOpen, setMenu, set_FontFamily, setBorderRadius } = customizationSlice.actions;
// export const { drawerWidth, gridSpacing } = initialState;

export const { setMenuOpen, setMenuType } = customizationSlice.actions

export default customizationSlice.reducer
