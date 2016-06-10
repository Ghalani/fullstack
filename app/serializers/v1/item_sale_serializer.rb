class ItemSaleSerializer < ActiveModel::Serializer
  attributes :id, :item, :sale, :quantity, :weight
end
