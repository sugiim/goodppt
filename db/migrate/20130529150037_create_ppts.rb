class CreatePpts < ActiveRecord::Migration
  def change
    create_table :ppts do |t|
        t.string :ppt_id, null: false
        t.string :ppt_name, null: false
        t.text :user_name
        t.text :ppt_desc
        t.integer :point
        t.integer :order
        t.timestamps
    end
  end
end
