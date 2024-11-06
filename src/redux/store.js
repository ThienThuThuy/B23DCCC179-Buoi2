import { configureStore } from '@reduxjs/toolkit';
import productReducer from './productSlice';

export const store = configureStore({
  reducer: {
    products: productReducer,
  },
  // Thêm middleware nếu cần (redux-thunk đã có mặc định)
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
  // Redux DevTools sẽ tự động kích hoạt trong môi trường phát triển
  devTools: process.env.NODE_ENV !== 'production',  // Chỉ bật devTools khi ở chế độ phát triển
});
