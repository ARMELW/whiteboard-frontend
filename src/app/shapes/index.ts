// Shapes module exports
export { default as shapesService } from './api/shapesService';
export { useShapes, useShape } from './hooks/useShapes';
export { useShapesActions } from './hooks/useShapesActions';
export type { 
  ShapeAsset, 
  UploadShapeData, 
  UpdateShapeData,
  ShapeStats,
  ShapeType,
  ShapeCategory,
  ShapeData,
  ListShapesParams,
  ListShapesResponse,
  UploadShapeResponse,
  GetShapeResponse,
  UpdateShapeResponse,
  DeleteShapeResponse,
  ShapeStatsResponse
} from './api/shapesService';
