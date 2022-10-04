use anchor_lang::prelude::*;

declare_id!("Gz9MyXRttiXTVGZFqGLWh25x1N65mKVBRmnV4bBLi9g3");

#[program]
pub mod solana_counter {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let counter_account = &mut ctx.accounts.counterAccount;
        counter_account.counter = 0;
        Ok(())
    }

    pub fn increase_counter(ctx: Context<IncreaseCounter>) -> Result<()> {
        let counter_account = &mut ctx.accounts.counterAccount;
        counter_account.counter = counter_account.counter + 1;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = user, space = 16)]
    pub counterAccount: Account<'info, CounterAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>
}
#[derive(Accounts)]
pub struct IncreaseCounter<'info> {
    #[account(mut)]
    pub counterAccount: Account<'info, CounterAccount>
}

#[account]
pub struct CounterAccount {
    pub counter: u16
}
