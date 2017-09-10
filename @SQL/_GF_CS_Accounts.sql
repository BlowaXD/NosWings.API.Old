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

Date: 2017-09-10 15:56:06
*/


-- ----------------------------
-- Table structure for _GF_CS_Accounts
-- ----------------------------
DROP TABLE [dbo].[_GF_CS_Accounts]
GO
CREATE TABLE [dbo].[_GF_CS_Accounts] (
[AccountId] bigint NOT NULL ,
[Money] bigint NOT NULL DEFAULT ((0)) ,
[Permissions] int NOT NULL DEFAULT ((0)) 
)


GO

-- ----------------------------
-- Foreign Key structure for table [dbo].[_GF_CS_Accounts]
-- ----------------------------
ALTER TABLE [dbo].[_GF_CS_Accounts] ADD FOREIGN KEY ([AccountId]) REFERENCES [dbo].[Account] ([AccountId]) ON DELETE CASCADE ON UPDATE NO ACTION
GO
