/*
Navicat SQL Server Data Transfer

Source Server         : NosWings V4
Source Server Version : 130000
Source Host           : 164.132.206.181:1433
Source Database       : opennos
Source Schema         : dbo

Target Server Type    : SQL Server
Target Server Version : 130000
File Encoding         : 65001

Date: 2017-09-10 15:56:37
*/


-- ----------------------------
-- Table structure for _GF_CS_Packs
-- ----------------------------
DROP TABLE [dbo].[_GF_CS_Packs]
GO
CREATE TABLE [dbo].[_GF_CS_Packs] (
[PackId] int NOT NULL IDENTITY(1,1) ,
[CategoryId] smallint NOT NULL ,
[Type] smallint NULL ,
[Price] int NOT NULL ,
[Name] varchar(60) NOT NULL ,
[Description] varchar(255) NULL ,
[SuperPrizeVnum] int NULL ,
[SuperPrizeQuantity] int NULL ,
[MinimumForSuperPrize] int NULL ,
[Image] varchar(255) NULL 
)


GO
DBCC CHECKIDENT(N'[dbo].[_GF_CS_Packs]', RESEED, 6)
GO

-- ----------------------------
-- Indexes structure for table _GF_CS_Packs
-- ----------------------------

-- ----------------------------
-- Primary Key structure for table _GF_CS_Packs
-- ----------------------------
ALTER TABLE [dbo].[_GF_CS_Packs] ADD PRIMARY KEY ([PackId])
GO

-- ----------------------------
-- Foreign Key structure for table [dbo].[_GF_CS_Packs]
-- ----------------------------
ALTER TABLE [dbo].[_GF_CS_Packs] ADD FOREIGN KEY ([CategoryId]) REFERENCES [dbo].[_GF_CS_Categories] ([CategoryId]) ON DELETE NO ACTION ON UPDATE NO ACTION
GO
