class CreatePpts < ActiveRecord::Migration
  def change
    create_table :ppts do |t|

      t.timestamps
    end
  end
end
