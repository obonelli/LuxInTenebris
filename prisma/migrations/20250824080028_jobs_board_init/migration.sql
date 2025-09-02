-- CreateTable
CREATE TABLE `Technology` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Technology_name_key`(`name`),
    UNIQUE INDEX `Technology_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `JobPosition` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `salaryMin` INTEGER NULL,
    `salaryMax` INTEGER NULL,
    `currency` VARCHAR(191) NOT NULL DEFAULT 'USD',
    `seniority` ENUM('INTERN', 'JUNIOR', 'MID', 'SENIOR', 'STAFF', 'LEAD', 'PRINCIPAL') NOT NULL,
    `workingScheme` ENUM('ONSITE', 'HYBRID', 'REMOTE') NOT NULL,
    `englishLevel` ENUM('A1', 'A2', 'B1', 'B2', 'C1', 'C2') NULL,
    `location` VARCHAR(191) NULL,
    `provider` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `JobPosition_title_idx`(`title`),
    INDEX `JobPosition_seniority_workingScheme_englishLevel_idx`(`seniority`, `workingScheme`, `englishLevel`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `JobTechnology` (
    `jobId` VARCHAR(191) NOT NULL,
    `technologyId` INTEGER NOT NULL,

    PRIMARY KEY (`jobId`, `technologyId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `JobTechnology` ADD CONSTRAINT `JobTechnology_jobId_fkey` FOREIGN KEY (`jobId`) REFERENCES `JobPosition`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `JobTechnology` ADD CONSTRAINT `JobTechnology_technologyId_fkey` FOREIGN KEY (`technologyId`) REFERENCES `Technology`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
