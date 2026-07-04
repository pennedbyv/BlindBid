import { Request, Response, NextFunction } from "express";

/**
 * Standard format for validation errors
 */
export interface ValidationErrorResponse {
  success: false;
  error: string;
  details?: string[];
}

/**
 * Validation rules checker functions
 */
export const validators = {
  nickname: (nick: string): string | null => {
    if (!nick || typeof nick !== "string") {
      return "Nickname is required and must be a string";
    }
    const trimmed = nick.trim();
    if (trimmed.length < 3 || trimmed.length > 15) {
      return "Nickname must be between 3 and 15 characters long";
    }
    // Letters and numbers only
    const regex = /^[a-zA-Z0-9]+$/;
    if (!regex.test(trimmed)) {
      return "Nickname can only contain letters and numbers (no spaces or special characters)";
    }
    return null;
  },

  sellerGoal: (goal: string): string | null => {
    if (!goal || typeof goal !== "string") {
      return "Seller goal is required and must be a string";
    }
    const trimmed = goal.trim();
    if (trimmed.length < 10 || trimmed.length > 300) {
      return "Seller goal must be between 10 and 300 characters long";
    }
    return null;
  },

  reservePrice: (price: string): string | null => {
    if (!price || typeof price !== "string") {
      return "Reserve price is required and must be a string";
    }
    const num = Number(price);
    if (isNaN(num) || num <= 0) {
      return "Reserve price must be a valid positive number";
    }
    return null;
  },

  bidAmount: (amount: string): string | null => {
    if (!amount || typeof amount !== "string") {
      return "Bid amount is required and must be a string";
    }
    const num = Number(amount);
    if (isNaN(num) || num <= 0) {
      return "Bid amount must be a valid positive number";
    }
    return null;
  },

  duration: (dur: number): string | null => {
    if (dur === undefined || dur === null || typeof dur !== "number") {
      return "Duration is required and must be a number";
    }
    if (!Number.isInteger(dur) || dur < 60 || dur > 3600) {
      return "Duration must be an integer between 60 and 3600 seconds";
    }
    return null;
  },

  auctionId: (id: any): string | null => {
    const num = Number(id);
    if (id === undefined || id === null || isNaN(num) || num < 0 || !Number.isInteger(num)) {
      return "Auction ID must be a non-negative integer";
    }
    return null;
  }
};

/**
 * Middleware: Validate seller auction creation payload
 */
export function validateCreateAuction(req: Request, res: Response, next: NextFunction) {
  const { vaultId, sellerGoal, nftBundle } = req.body;
  const errors: string[] = [];

  const vaultError = validators.auctionId(vaultId);
  if (vaultError) errors.push(vaultError);

  const goalError = validators.sellerGoal(sellerGoal);
  if (goalError) errors.push(goalError);

  if (!nftBundle || !Array.isArray(nftBundle) || nftBundle.length === 0) {
    errors.push("nftBundle must be a non-empty array of NFT metadata objects");
  } else {
    for (let i = 0; i < nftBundle.length; i++) {
      const nft = nftBundle[i];
      if (nft.tokenId === undefined || nft.tokenId === null || isNaN(Number(nft.tokenId))) {
        errors.push(`NFT at index ${i} is missing a valid tokenId`);
      }
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: "Validation failed",
      details: errors
    } as ValidationErrorResponse);
  }

  next();
}

/**
 * Middleware: Validate buyer session nickname registration payload
 */
export function validateRegisterNickname(req: Request, res: Response, next: NextFunction) {
  const auctionId = req.params.id;
  const { walletAddress, nickname } = req.body;
  const errors: string[] = [];

  const idError = validators.auctionId(auctionId);
  if (idError) errors.push(idError);

  if (!walletAddress || typeof walletAddress !== "string" || !walletAddress.startsWith("0x")) {
    errors.push("walletAddress is required and must be a valid hex address starting with 0x");
  }

  const nickError = validators.nickname(nickname);
  if (nickError) errors.push(nickError);

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: "Validation failed",
      details: errors
    } as ValidationErrorResponse);
  }

  next();
}

/**
 * Middleware: Validate buyer bid placement payload
 */
export function validatePlaceBid(req: Request, res: Response, next: NextFunction) {
  const auctionId = req.params.id;
  const { walletAddress, bidAmount } = req.body;
  const errors: string[] = [];

  const idError = validators.auctionId(auctionId);
  if (idError) errors.push(idError);

  if (!walletAddress || typeof walletAddress !== "string" || !walletAddress.startsWith("0x")) {
    errors.push("walletAddress is required and must be a valid hex address starting with 0x");
  }

  const amountError = validators.bidAmount(bidAmount);
  if (amountError) errors.push(amountError);

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: "Validation failed",
      details: errors
    } as ValidationErrorResponse);
  }

  next();
}
