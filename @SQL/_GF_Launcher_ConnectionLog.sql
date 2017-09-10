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

Date: 2017-09-10 15:56:48
*/


-- ----------------------------
-- Table structure for _GF_Launcher_ConnectionLog
-- ----------------------------
DROP TABLE [dbo].[_GF_Launcher_ConnectionLog]
GO
CREATE TABLE [dbo].[_GF_Launcher_ConnectionLog] (
[ConnectionId] int NOT NULL IDENTITY(1,1) ,
[AccountName] nvarchar(50) NULL ,
[Server] nvarchar(50) NULL ,
[IpAddress] varchar(15) NULL ,
[UUID] varchar(36) NULL ,
[ComputerName] varchar(255) NULL ,
[Date] datetime2(7) NOT NULL DEFAULT (getdate()) 
)


GO
ALTER TABLE [dbo].[_GF_Launcher_ConnectionLog] SET (LOCK_ESCALATION = AUTO)
GO
DBCC CHECKIDENT(N'[dbo].[_GF_Launcher_ConnectionLog]', RESEED, 12187)
GO
