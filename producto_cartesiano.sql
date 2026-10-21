-- =============================================================================
-- Script: Consulta con INNER JOIN de todas las tablas de la base de datos Ecommerce
-- Tablas involucradas:
--   1. users
--   2. roles
--   3. user_has_roles
--   4. categories
--   5. products
--   6. address
--   7. orders
--   8. order_has_products
-- =============================================================================

USE Ecommerce;

-- -----------------------------------------------------------------------------
-- CONSULTA 1: INNER JOIN estándar (todas las columnas de cada tabla)
-- Relaciona todas las tablas mediante sus llaves primarias y foráneas.
-- -----------------------------------------------------------------------------
SELECT *
FROM users u
INNER JOIN user_has_roles uhr ON u.id = uhr.id_user
INNER JOIN roles r ON uhr.id_rol = r.id
INNER JOIN address a ON u.id = a.id_user
INNER JOIN orders o ON u.id = o.id_client AND a.id = o.id_address
INNER JOIN order_has_products ohp ON o.id = ohp.id_order
INNER JOIN products p ON ohp.id_product = p.id
INNER JOIN categories c ON p.id_category = c.id;

-- -----------------------------------------------------------------------------
-- CONSULTA 2: INNER JOIN con alias de columnas (evita colisiones de nombres)
-- Recomendado para clientes SQL, exportaciones a CSV/JSON o APIs, donde columnas
-- con nombres repetidos ('id', 'name', 'created_at', 'updated_at') se sobreescribirían.
-- -----------------------------------------------------------------------------
SELECT
    -- Tabla: users
    u.id AS user_id,
    u.name AS user_name,
    u.lastname AS user_lastname,
    u.email AS user_email,
    u.phone AS user_phone,
    u.image AS user_image,
    u.notification_token AS user_notification_token,
    u.created_at AS user_created_at,
    u.updated_at AS user_updated_at,

    -- Tabla: roles
    r.id AS role_id,
    r.name AS role_name,
    r.image AS role_image,
    r.route AS role_route,
    r.created_at AS role_created_at,
    r.updated_at AS role_updated_at,

    -- Tabla: user_has_roles
    uhr.id_user AS uhr_id_user,
    uhr.id_rol AS uhr_id_rol,

    -- Tabla: categories
    c.id AS category_id,
    c.name AS category_name,
    c.description AS category_description,
    c.image AS category_image,
    c.created_at AS category_created_at,
    c.updated_at AS category_updated_at,

    -- Tabla: products
    p.id AS product_id,
    p.name AS product_name,
    p.description AS product_description,
    p.price AS product_price,
    p.image1 AS product_image1,
    p.image2 AS product_image2,
    p.id_category AS product_id_category,
    p.created_at AS product_created_at,
    p.updated_at AS product_updated_at,

    -- Tabla: address
    a.id AS address_id,
    a.address AS address_address,
    a.neighborhood AS address_neighborhood,
    a.id_user AS address_id_user,
    a.created_at AS address_created_at,
    a.updated_at AS address_updated_at,

    -- Tabla: orders
    o.id AS order_id,
    o.id_client AS order_id_client,
    o.id_address AS order_id_address,
    o.status AS order_status,
    o.created_at AS order_created_at,
    o.updated_at AS order_updated_at,

    -- Tabla: order_has_products
    ohp.id_order AS ohp_id_order,
    ohp.id_product AS ohp_id_product,
    ohp.quantity AS ohp_quantity,
    ohp.created_at AS ohp_created_at,
    ohp.updated_at AS ohp_updated_at

FROM users u
INNER JOIN user_has_roles uhr ON u.id = uhr.id_user
INNER JOIN roles r ON uhr.id_rol = r.id
INNER JOIN address a ON u.id = a.id_user
INNER JOIN orders o ON u.id = o.id_client AND a.id = o.id_address
INNER JOIN order_has_products ohp ON o.id = ohp.id_order
INNER JOIN products p ON ohp.id_product = p.id
INNER JOIN categories c ON p.id_category = c.id;

