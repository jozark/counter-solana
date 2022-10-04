use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod solana_counter {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let counter_account = &mut ctx.accounts.counter_account;
        counter_account.counter = 0;
        Ok(())
    }

    pub fn increase_counter(ctx: Context<IncreaseCounter>) -> Result<()> {
        let counter_account = &mut ctx.accounts.counter_account;
        counter_account.counter = counter_account.counter + 1;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = user, space = 32)]
    pub counter_account: Account<'info, CounterAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>
}
#[derive(Accounts)]
pub struct IncreaseCounter<'info> {
    #[account(mut)]
    pub counter_account: Account<'info, CounterAccount>
}

#[account]
pub struct CounterAccount {
    pub counter: u16
}
