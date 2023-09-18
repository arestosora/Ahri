-- CreateTable
CREATE TABLE `Users` (
    `UserID` VARCHAR(191) NOT NULL,
    `Pedidos` INTEGER NOT NULL DEFAULT 1,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`UserID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pedidos` (
    `Referencia` VARCHAR(191) NOT NULL,
    `Cuentas_Asignadas` VARCHAR(191) NULL,
    `SN` VARCHAR(191) NOT NULL,
    `UserID` VARCHAR(191) NOT NULL,
    `Pedido` VARCHAR(191) NOT NULL,
    `Estado` VARCHAR(191) NOT NULL DEFAULT 'Pendiente',
    `Comprobante` VARCHAR(191) NOT NULL,
    `GuildID` VARCHAR(191) NOT NULL DEFAULT '1133932007236309072',
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    PRIMARY KEY (`Referencia`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Config` (
    `GuildID` VARCHAR(191) NOT NULL DEFAULT '1133932007236309072',
    `Pedidos_Enabled` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`GuildID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Cuentas` (
    `Nickname` VARCHAR(191) NOT NULL,
    `Username` VARCHAR(191) NOT NULL,
    `Password` VARCHAR(191) NOT NULL,
    `RPDisponibles` INTEGER NOT NULL DEFAULT 2295,
    `Nota` VARCHAR(191) NULL,
    `Estado` VARCHAR(191) NOT NULL DEFAULT 'Disponible',
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    PRIMARY KEY (`Username`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Cuentas_Combos` (
    `Nickname` VARCHAR(191) NOT NULL,
    `Username` VARCHAR(191) NOT NULL,
    `Password` VARCHAR(191) NOT NULL,
    `RPDisponibles` INTEGER NOT NULL DEFAULT 2295,
    `Nota` VARCHAR(191) NULL,
    `Estado` VARCHAR(191) NOT NULL DEFAULT 'Disponible',
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    PRIMARY KEY (`Username`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Cuentas_Banco` (
    `Nickname` VARCHAR(191) NOT NULL,
    `Username` VARCHAR(191) NOT NULL,
    `Password` VARCHAR(191) NOT NULL,
    `RPDisponibles` INTEGER NOT NULL DEFAULT 2295,
    `Nota` VARCHAR(191) NULL,
    `Estado` VARCHAR(191) NOT NULL DEFAULT 'Disponible',
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    PRIMARY KEY (`Username`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
