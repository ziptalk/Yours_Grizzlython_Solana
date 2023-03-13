use anchor_lang::solana_program::entrypoint::ProgramResult;

use {
    anchor_lang::{prelude::*, solana_program::program::invoke, system_program},
    anchor_spl::{associated_token, token},
    mpl_token_metadata::{instruction as token_instruction, ID as TOKEN_METADATA_ID},
};

pub fn mint(
    ctx: Context<MintNFT>,
    metadata_title: String,
    metadata_symbol: String,
    metadata_uri: String,
    benefit_uri: String,
    benefits: Vec<u64>,
) -> Result<()> {
    create_mint_account(&ctx)?;
    initialize_mint_account(&ctx)?;
    create_token_account(&ctx)?;
    mint_token_to_account(&ctx)?;
    create_metadata_account(&ctx, metadata_title, metadata_symbol, metadata_uri)?;
    //create_master_edition_metadata_account(&ctx)?;
    //create_benefit_info(&mut ctx, benefit_uri)?;
    //create_benefits(&mut ctx, benefits)?;
    msg!("Token mint process completed successfully.");
    Ok(())
}

#[derive(Accounts)]
#[instruction(benefit_uri: String)]
pub struct MintNFT<'info> {
    /// CHECK: We are about to create this with Metaplex
    #[account(mut)]
    pub metadata: UncheckedAccount<'info>,
    /// CHECK: We are about to create this with Metaplex
    #[account(mut)]
    pub master_edition: UncheckedAccount<'info>,
    #[account(mut)]
    pub mint: Signer<'info>,
    /// CHECK: We are about to create this with Anchor
    #[account(mut)]
    pub token_account: UncheckedAccount<'info>,
    #[account(mut)]
    pub mint_authority: Signer<'info>,
    #[account(
        init,
        seeds = [b"benefitURI", mint.key().as_ref()],
        bump,
        payer = mint_authority,
        space = benefit_uri.len() + 4 + 8
    )]
    pub benefit_info: Account<'info, BenefitURIAccount>,
    #[account(
        init,
        seeds = [b"benefit", mint.key().as_ref(), mint_authority.key().as_ref()],
        bump,
        payer = mint_authority,
        space = benefit_uri.len() + 4 + 8
    )]
    pub benefits: Account<'info, Benefits>,
    //------program served------
    pub rent: Sysvar<'info, Rent>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, token::Token>,
    pub associated_token_program: Program<'info, associated_token::AssociatedToken>,
    //------program served------
    /// CHECK: Metaplex will check this
    pub token_metadata_program: UncheckedAccount<'info>,
}

#[account]
pub struct BenefitURIAccount {
    pub benefit_uri: String,
}

#[account]
pub struct Benefits {
    pub benefits: Vec<u64>
}

fn create_mint_account(ctx: &Context<MintNFT>) -> Result<()> {
    msg!("Creating mint account...");
    msg!("Mint: {}", &ctx.accounts.mint.key());
    system_program::create_account(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            system_program::CreateAccount {
                from: ctx.accounts.mint_authority.to_account_info(),
                to: ctx.accounts.mint.to_account_info(),
            },
        ),
        10000000,
        82,
        &ctx.accounts.token_program.key(),
    )
}

fn initialize_mint_account(ctx: &Context<MintNFT>) -> Result<()> {
    msg!("Initializing mint account...");
    msg!("Mint: {}", &ctx.accounts.mint.key());
    token::initialize_mint(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            token::InitializeMint {
                mint: ctx.accounts.mint.to_account_info(),
                rent: ctx.accounts.rent.to_account_info(),
            },
        ),
        0,
        &ctx.accounts.mint_authority.key(),
        Some(&ctx.accounts.mint_authority.key()),
    )
}

fn create_token_account(ctx: &Context<MintNFT>) -> Result<()> {
    msg!("Creating token account...");
    msg!("Token Address: {}", &ctx.accounts.token_account.key());
    associated_token::create(CpiContext::new(
        ctx.accounts.associated_token_program.to_account_info(),
        associated_token::Create {
            payer: ctx.accounts.mint_authority.to_account_info(),
            associated_token: ctx.accounts.token_account.to_account_info(),
            authority: ctx.accounts.mint_authority.to_account_info(),
            mint: ctx.accounts.mint.to_account_info(),
            system_program: ctx.accounts.system_program.to_account_info(),
            token_program: ctx.accounts.token_program.to_account_info(),
            rent: ctx.accounts.rent.to_account_info(),
        },
    ))
}

fn mint_token_to_account(ctx: &Context<MintNFT>) -> Result<()> {
    msg!("Minting token to token account...");
    msg!("Mint: {}", &ctx.accounts.mint.to_account_info().key());
    msg!("Token Address: {}", &ctx.accounts.token_account.key());
    token::mint_to(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            token::MintTo {
                mint: ctx.accounts.mint.to_account_info(),
                to: ctx.accounts.token_account.to_account_info(),
                authority: ctx.accounts.mint_authority.to_account_info(),
            },
        ),
        1,
    )
}

fn create_metadata_account(
    ctx: &Context<MintNFT>,
    metadata_title: String,
    metadata_symbol: String,
    metadata_uri: String,
) -> ProgramResult {
    msg!("Creating metadata account...");
    msg!(
        "Metadata account address: {}",
        &ctx.accounts.metadata.to_account_info().key()
    );
    invoke(
        &token_instruction::create_metadata_accounts_v2(
            TOKEN_METADATA_ID,
            ctx.accounts.metadata.key(),
            ctx.accounts.mint.key(),
            ctx.accounts.mint_authority.key(),
            ctx.accounts.mint_authority.key(),
            ctx.accounts.mint_authority.key(),
            metadata_title,
            metadata_symbol,
            metadata_uri,
            None,
            1,
            true,
            false,
            None,
            None,
        ),
        &[
            ctx.accounts.metadata.to_account_info(),
            ctx.accounts.mint.to_account_info(),
            ctx.accounts.token_account.to_account_info(),
            ctx.accounts.mint_authority.to_account_info(),
            ctx.accounts.rent.to_account_info(),
        ],
    )
}

fn create_master_edition_metadata_account(ctx: &Context<MintNFT>) -> ProgramResult {
    msg!("Creating master edition metadata account...");
    msg!(
        "Master edition metadata account address: {}",
        &ctx.accounts.master_edition.to_account_info().key()
    );
    invoke(
        &token_instruction::create_master_edition_v3(
            TOKEN_METADATA_ID,
            ctx.accounts.master_edition.key(),
            ctx.accounts.mint.key(),
            ctx.accounts.mint_authority.key(),
            ctx.accounts.mint_authority.key(),
            ctx.accounts.metadata.key(),
            ctx.accounts.mint_authority.key(),
            Some(0),
        ),
        &[
            ctx.accounts.master_edition.to_account_info(),
            ctx.accounts.metadata.to_account_info(),
            ctx.accounts.mint.to_account_info(),
            ctx.accounts.token_account.to_account_info(),
            ctx.accounts.mint_authority.to_account_info(),
            ctx.accounts.rent.to_account_info(),
        ],
    )
}

fn create_benefit_info(ctx: Context<MintNFT>, benefitURI: String ) -> ProgramResult {
    msg!("Creating benefit info...");
    msg!("Mint: {}", &ctx.accounts.benefit_info.key());
    let benefit_account =  &mut ctx.accounts.benefit_info;
    benefit_account.benefit_uri = benefitURI;
    Ok(())
}

fn create_benefits(ctx: Context<MintNFT>, benefits: Vec<u64>) -> ProgramResult {
    msg!("Setting benefit list...");
    let benefits_account = &mut ctx.accounts.benefits;
    benefits_account.benefits = benefits;
    Ok(())
}
