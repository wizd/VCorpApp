import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Company, initialCompanyState, registerUserToServer } from './company';

// The rest of your imports and constants...

// Async thunk action for registering a user
export const registerUser = createAsyncThunk(
  'company/registerUser',
  async (_, { dispatch, getState }) => {
    // Your existing registerUser logic...
    const state = getState() as { company: Company };
    const jwt = await registerUserToServer(
      state.company.config.API_URL,
      state.company.privatekey,
    );
    dispatch(updateJwt(jwt));
    return Promise.resolve();
  },
);

const companySlice = createSlice({
  name: 'company',
  initialState: initialCompanyState,
  reducers: {
    updateCompany: (state, action) => {
      return { ...state, ...action.payload };
    },
    updateJwt: (state, action) => {
      return {
        ...state,
        jwt: action.payload,
      };
    },
    setSettings: (state, action) => {
      return {
        ...state,
        settings: action.payload,
      };
    },
    fireEmployee: (state, action) => {
      return {
        ...state,
        employees: [...state.employees.filter(e => e.id !== action.payload)],
      };
    },
    updateEmployee: (state, action) => {
      const employee = state.employees.find(e => e.id === action.payload.id);
      if (employee) {
        return {
          ...state,
          employees: [
            ...state.employees.filter(e => e.id !== action.payload.id),
            {
              ...employee,
              name: action.payload.newName,
              note: action.payload.newDescription,
            },
          ],
        };
      }
      return state;
    },
    chooseEmployee: (state, action) => {
      return {
        ...state,
        curid: action.payload,
      };
    },
    hireNewEmployee: (state, action) => {
      return {
        ...state,
        employees: [
          ...state.employees,
          {
            id: action.payload.id,
            name: action.payload.name,
            desc: action.payload.desc,
            avatar: action.payload.avatar,
          },
        ],
      };
    },
    tourialDone: (state, _) => {
      return {
        ...state,
        settings: {
          ...state.settings,
          guide: false,
        },
      };
    },
    setAIBusy: (state, action) => {
      console.log('setAIBusy to', action.payload);
      return {
        ...state,
        isAILoading: action.payload,
      };
    },
    uploadFileSuccess: (state, action) => {
      return {
        ...state,
        uploaded: action.payload,
      };
    },
  },
  // extraReducers: builder => {
  //   builder.addCase(registerUser.fulfilled, (state, action) => {
  //     // Update the company state with the loaded data
  //     return state;
  //   });
  // },
});

export const {
  updateCompany,
  updateJwt,
  setSettings,
  fireEmployee,
  updateEmployee,
  chooseEmployee,
  hireNewEmployee,
  tourialDone,
  setAIBusy,
  uploadFileSuccess,
} = companySlice.actions;

export default companySlice.reducer;
