class PptsController < ApplicationController
    
    
    def index
        # @ppts = Ppt.order("p_order")
        _p = Ppt.order("p_order")
        
        render :json => _p
    end
    
    def init
        # @ppts = Ppt.order("p_order")
        #_p = Ppt.order("p_order")
        #render :json => _p
    end
    
    def show
        @ppt = Ppt.where(ppt_id: params[:ppt_id])[0]
    end
    
    def show2
        @ppt = Ppt.where(ppt_id: params[:ppt_id])[0]
        render :json => @ppt
    end
    
    
    def new
    end
    
    def edit
    end
    
    def create
    end
    
    def update
        logger.debug("PptsController update")
        _ppt = Ppt.where(ppt_id: params[:ppt_id])[0]
        _ppt.point = _ppt.point+1
        ret = _ppt.save
        logger.debug(ret)
        render :json => ret

    end
    
    def destroy
    end
    
    def reset
        
        Ppt.update_all('point=0')
        
    end
    
    
    
end
