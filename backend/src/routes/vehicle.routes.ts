import { Router } from 'express';
import { VehicleController } from '../controllers/vehicle.controller';
import { InventoryController } from '../controllers/inventory.controller';
import { authenticateJWT } from '../middleware/auth.middleware';
import { authorizeAdmin } from '../middleware/admin.middleware';
import {
  vehicleCreateValidator,
  vehicleUpdateValidator,
  searchValidator,
  inventoryActionValidator,
} from '../validators/vehicle.validator';
import { handleValidationErrors } from '../middleware/validation.middleware';

const router = Router();

// Apply authentication middleware to all vehicle routes
router.use(authenticateJWT);

// Search is a query-based route. Must be defined before :id route
router.get('/search', searchValidator, handleValidationErrors, VehicleController.search);

// Get purchase history for standard user or admin
router.get('/purchases', InventoryController.getPurchaseHistory);

// CRUD
router.post(
  '/',
  authorizeAdmin,
  vehicleCreateValidator,
  handleValidationErrors,
  VehicleController.create
);
router.get('/', VehicleController.list);
router.get('/:id', VehicleController.getById);
router.put(
  '/:id',
  authorizeAdmin,
  vehicleUpdateValidator,
  handleValidationErrors,
  VehicleController.update
);
router.delete('/:id', authorizeAdmin, VehicleController.delete);

// Inventory Actions
router.post(
  '/:id/purchase',
  inventoryActionValidator,
  handleValidationErrors,
  InventoryController.purchase
);
router.post(
  '/:id/restock',
  authorizeAdmin,
  inventoryActionValidator,
  handleValidationErrors,
  InventoryController.restock
);

export default router;
