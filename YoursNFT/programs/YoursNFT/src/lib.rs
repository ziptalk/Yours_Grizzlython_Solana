use anchor_lang::prelude::*;

pub mod mint;
pub mod sell;

use mint::*;
use sell::*;

declare_id!("AofVbSrzmpWsg4vym4Gq3uCzKqtRjZLTMo8FTvycR8MZ");

#[program]
pub mod yours_nft {
    use super::*;

    pub fn mint(
        ctx: Context<MintNFT>,
        metadata_title: String,
        metadata_symbol: String,
        metadata_uri: String,
        benefit_uri: String,
        benefits: Vec<u64>,
    ) -> Result<()> {
        mint::mint(ctx, metadata_title, metadata_symbol, metadata_uri, benefit_uri, benefits)
    }

    pub fn sell(ctx: Context<SellNFT>, sale_lamports: u64) -> Result<()> {
        sell::sell(ctx, sale_lamports)
    }
}
