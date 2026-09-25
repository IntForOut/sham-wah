from app import state

def get_driver() :
    return state.driver

async def close_driver():
    if state.driver:
        await state.driver.close()
        state.driver = None