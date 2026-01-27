import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import TicketService from './TicketService'
import { showMessage } from 'react-native-flash-message'

const initialState = {
    allTickets: [],
    customerTickets: [],
    ticket: null,
    publicComments: [],
    privateComments: [],
    attachments: [],
    isTicketLoading: false,
    isTicketSuccess: false,
    isTicketError: false,
    message: '',
    isSendingComment: false,
}

const getError = (err) =>
    err?.response?.data?.message || err.message || 'Something went wrong'

// ✅ Async Thunks
export const createTicket = createAsyncThunk(
    'ticket/create',
    async (data, thunkAPI) => {
        try {
            return await TicketService.create(data)
        } catch (error) {
            return thunkAPI.rejectWithValue(getError(error))
        }
    }
)

export const createInternalTicket = createAsyncThunk(
    'ticket/createInternal',
    async (data, thunkAPI) => {
        try {
            return await TicketService.createInternal(data)
        } catch (error) {
            return thunkAPI.rejectWithValue(getError(error))
        }
    }
)

// export const createFlexibleTicket = createAsyncThunk(
//     'ticket/createFlexible',
//     async (data, thunkAPI) => {
//         try {
//             return await TicketService.createFlexible(data)
//         } catch (error) {
//             return thunkAPI.rejectWithValue(getError(error))
//         }
//     }
// )

export const getAllTickets = createAsyncThunk(
    'ticket/getAll',
    async (query, thunkAPI) => {
        try {
            return await TicketService.getAll(query)
        } catch (error) {
            return thunkAPI.rejectWithValue(getError(error))
        }
    }
)

export const getTicketById = createAsyncThunk(
    'ticket/getById',
    async (id, thunkAPI) => {
        try {
            return await TicketService.getById(id)
        } catch (error) {
            return thunkAPI.rejectWithValue(getError(error))
        }
    }
)

export const getCustomerTickets = createAsyncThunk(
    'ticket/getCustomerTickets',
    async (customerId, thunkAPI) => {
        try {
            return await TicketService.getByCustomer(customerId)
        } catch (error) {
            return thunkAPI.rejectWithValue(getError(error))
        }
    }
)

export const updateTicket = createAsyncThunk(
    'ticket/update',
    async ({ id, data }, thunkAPI) => {
        try {
            return await TicketService.update(id, data)
        } catch (error) {
            return thunkAPI.rejectWithValue(getError(error))
        }
    }
)

export const deleteTicket = createAsyncThunk(
    'ticket/delete',
    async (id, thunkAPI) => {
        try {
            return await TicketService.delete(id)
        } catch (error) {
            return thunkAPI.rejectWithValue(getError(error))
        }
    }
)

export const assignTicket = createAsyncThunk(
    'ticket/assign',
    async ({ id, data }, thunkAPI) => {
        try {
            return await TicketService.assign(id, data)
        } catch (error) {
            return thunkAPI.rejectWithValue(getError(error))
        }
    }
)

export const resolveTicket = createAsyncThunk(
    'ticket/resolve',
    async ({ id, data }, thunkAPI) => {
        try {
            return await TicketService.resolve(id, data)
        } catch (error) {
            return thunkAPI.rejectWithValue(getError(error))
        }
    }
)

export const bulkUpdateTickets = createAsyncThunk(
    'ticket/bulkUpdate',
    async (payload, thunkAPI) => {
        try {
            return await TicketService.bulkUpdate(payload)
        } catch (error) {
            return thunkAPI.rejectWithValue(getError(error))
        }
    }
)

// 💬 New Comment Thunks
export const addPublicComment = createAsyncThunk(
    'ticket/addPublicComment',
    async ({ ticketId, content }, thunkAPI) => {
        try {
            return await TicketService.addPublicComment(ticketId, { content })
        } catch (error) {
            return thunkAPI.rejectWithValue(getError(error))
        }
    }
)

export const getPublicComments = createAsyncThunk(
    'ticket/getPublicComments',
    async (ticketId, thunkAPI) => {
        try {
            return await TicketService.getPublicComments(ticketId)
        } catch (error) {
            return thunkAPI.rejectWithValue(getError(error))
        }
    }
)

export const addPrivateComment = createAsyncThunk(
    'ticket/addPrivateComment',
    async ({ ticketId, content }, thunkAPI) => {
        try {
            return await TicketService.addPrivateComment(ticketId, { content })
        } catch (error) {
            return thunkAPI.rejectWithValue(getError(error))
        }
    }
)

export const getPrivateComments = createAsyncThunk(
    'ticket/getPrivateComments',
    async (ticketId, thunkAPI) => {
        try {
            return await TicketService.getPrivateComments(ticketId)
        } catch (error) {
            return thunkAPI.rejectWithValue(getError(error))
        }
    }
)

// 📎 New Attachment Thunks
export const addAttachmentToTicket = createAsyncThunk(
    'ticket/addAttachmentToTicket',
    async ({ ticketId, formData }, thunkAPI) => {
        try {
            return await TicketService.addAttachmentToTicket(ticketId, formData)
        } catch (error) {
            return thunkAPI.rejectWithValue(getError(error))
        }
    }
)

export const addAttachmentToComment = createAsyncThunk(
    'ticket/addAttachmentToComment',
    async ({ commentId, formData }, thunkAPI) => {
        try {
            return await TicketService.addAttachmentToComment(
                commentId,
                formData
            )
        } catch (error) {
            return thunkAPI.rejectWithValue(getError(error))
        }
    }
)

export const getMyTickets = createAsyncThunk(
    'tickets/getMyTickets',
    async (_, thunkAPI) => {
        try {
            return await TicketService.getTicketsForUser()
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || 'Failed to fetch user tickets'
            )
        }
    }
)

const ticketSlice = createSlice({
    name: 'ticket',
    initialState,
    reducers: {
        resetTicketState: (state) => {
            state.isTicketLoading = false
            state.isTicketSuccess = false
            state.isTicketError = false
            state.message = ''
            state.ticket = null
            state.publicComments = []
            state.privateComments = []
            state.attachments = []
        },
        addRealTimePublicComment: (state, action) => {
            const newComment = action.payload
            if (state.ticket) {
                // Push the new comment into the existing publicComments array
                state.publicComments.push(newComment)
            }
        },

        // A temporary reducer for optimistic UI updates
        // optimisticUpdateTicket: (state, action) => {
        //   const { ticketId, newStatus, newAssignedTo, newAssignedToModel } = action.payload;
        //   state.allTickets = state.allTickets.map((ticket) => {
        //     if (ticket._id === ticketId) {
        //       return {
        //         ...ticket,
        //         status: newStatus || ticket.status,
        //         assignedTo: newAssignedTo || ticket.assignedTo,
        //         assignedToModel: newAssignedToModel || ticket.assignedToModel
        //       };
        //     }
        //     return ticket;
        //   });
        // }
        optimisticUpdateTicket: (state, action) => {
            const { ticketId, newStatus, newAssignedTo, newAssignedToModel } =
                action.payload
            state.allTickets = state.allTickets.map((ticket) => {
                if (ticket._id === ticketId) {
                    return {
                        ...ticket,
                        status: newStatus ?? ticket.status,
                        assignedTo: newAssignedTo ?? ticket.assignedTo,
                        assignedToModel:
                            newAssignedToModel ?? ticket.assignedToModel,
                    }
                }
                return ticket
            })
        },
    },
    extraReducers: (builder) => {
        builder
            // Handle all async thunks
            .addCase(createTicket.fulfilled, (state, action) => {
                state.isTicketLoading = false
                state.isTicketSuccess = true
                state.ticket = action.payload
                showMessage({
                    message: 'Ticket created successfully!',
                    type: 'success',
                })
            })
            .addCase(createInternalTicket.fulfilled, (state, action) => {
                state.isTicketLoading = false
                state.isTicketSuccess = true
                state.ticket = action.payload
                showMessage({
                    message: 'Ticket created successfully!',
                    type: 'success',
                })
            })

            .addCase(getAllTickets.fulfilled, (state, action) => {
                state.isTicketLoading = false
                state.isTicketSuccess = true
                state.allTickets = action.payload
            })
            .addCase(getCustomerTickets.fulfilled, (state, action) => {
                state.isTicketLoading = false
                state.isTicketSuccess = true
                state.customerTickets = action.payload
            })
            .addCase(getMyTickets.fulfilled, (state, action) => {
                state.isTicketLoading = false
                state.isTicketSuccess = true
                state.customerTickets = action.payload
            })

            .addCase(updateTicket.fulfilled, (state, action) => {
                state.isTicketLoading = false
                state.isTicketSuccess = true
                const updatedTicket = action.payload
                state.allTickets = state.allTickets.map((ticket) =>
                    ticket._id === updatedTicket._id ? updatedTicket : ticket
                )
                showMessage({
                    message: 'Ticket updated successfully!',
                    type: 'success',
                })
            })
            // Delete Ticket
            .addCase(deleteTicket.fulfilled, (state, action) => {
                state.isTicketLoading = false
                state.isTicketSuccess = true
                state.allTickets = state.allTickets.filter(
                    (ticket) => ticket._id !== action.meta.arg
                )
                showMessage({
                    message: 'Ticket Deletd successfully!',
                    type: 'success',
                })
            })
            // Assign Ticket
            .addCase(assignTicket.fulfilled, (state, action) => {
                state.isTicketLoading = false
                state.isTicketSuccess = true
                const updatedTicket = action.payload
                state.allTickets = state.allTickets.map((ticket) =>
                    ticket._id === updatedTicket._id ? updatedTicket : ticket
                )
                showMessage({
                    message: 'Ticket Assigned successfully!',
                    type: 'success',
                })
            })
            // Resolve Ticket
            .addCase(resolveTicket.fulfilled, (state, action) => {
                state.isTicketLoading = false
                state.isTicketSuccess = true
                const updatedTicket = action.payload
                state.allTickets = state.allTickets.map((ticket) =>
                    ticket._id === updatedTicket._id ? updatedTicket : ticket
                )
                showMessage({
                    message: 'Ticket Resolved ',
                    type: 'success',
                })
            })
            .addCase(bulkUpdateTickets.fulfilled, (state) => {
                state.isTicketLoading = false
                state.isTicketSuccess = true
                // No specific state update needed, as it's a bulk operation.
                // You might refetch or handle this differently if needed.

                showMessage({
                    message: 'Tickets updated successfully!',
                    type: 'success',
                })
            })
            .addCase(getTicketById.fulfilled, (state, action) => {
                state.isTicketLoading = false
                state.isTicketSuccess = true
                state.ticket = action.payload
                state.publicComments = action.payload.publicComments || [] // Populate comments
                state.privateComments = action.payload.privateComments || []
                state.attachments = action.payload.attachments || []
            })
            // 💬 New Comment Cases
            // .addCase(addPublicComment.fulfilled, (state, action) => {
            //     state.isTicketLoading = false
            //     state.isTicketSuccess = true
            //     state.publicComments.push(action.payload)
            //     showMessage({
            //         message: 'Messeage Sent',
            //         type: 'success',
            //     })
            // })
            .addCase(addPublicComment.fulfilled, (state, action) => {
                state.isTicketLoading = false
                state.isTicketSuccess = true

                // Only update the nested array if a ticket is currently loaded
                if (state.ticket) {
                    state.ticket.publicComments.push(action.payload)
                }

                showMessage({
                    message: 'Message Sent',
                    type: 'success',
                })
            })
            .addCase(getPublicComments.fulfilled, (state, action) => {
                state.isTicketLoading = false
                state.isTicketSuccess = true
                state.publicComments = action.payload
            })
            .addCase(addPrivateComment.fulfilled, (state, action) => {
                state.isTicketLoading = false
                state.isTicketSuccess = true
                state.privateComments.push(action.payload)
                showMessage({
                    message: 'Messeage Sent "Internal"',
                    type: 'success',
                })
            })
            .addCase(getPrivateComments.fulfilled, (state, action) => {
                state.isTicketLoading = false
                state.isTicketSuccess = true
                state.privateComments = action.payload
            })
            // 📎 New Attachment Cases
            .addCase(addAttachmentToTicket.fulfilled, (state, action) => {
                state.isTicketLoading = false
                state.isTicketSuccess = true
                if (state.ticket) {
                    state.ticket.attachments.push(action.payload)
                }
                showMessage({
                    message: 'Attachment added to ticket',
                    type: 'success',
                })
            })
            // No specific case needed for addAttachmentToComment, as it modifies a comment, not the main ticket state
            // Instead, a re-fetch of the ticket data would update the UI.
            // Or you could implement optimistic updates for comments as well.

            // Matchers for common loading and error states
            .addMatcher(
                (action) =>
                    action.type.startsWith('ticket/') &&
                    action.type.endsWith('/pending'),
                (state) => {
                    state.isTicketLoading = true
                    state.isTicketError = false
                    state.isTicketSuccess = false
                }
            )
            .addMatcher(
                (action) =>
                    action.type.startsWith('ticket/') &&
                    action.type.endsWith('/rejected'),
                (state, action) => {
                    state.isTicketLoading = false
                    state.isTicketError = true
                    state.isTicketSuccess = false
                    state.message = action.payload
                    showMessage({
                        message: action.payload,
                        type: 'danger',
                    })
                    console.error('error ', action.payload)
                }
            )
    },
})

export const { resetTicketState, optimisticUpdateTicket } = ticketSlice.actions
export default ticketSlice.reducer
